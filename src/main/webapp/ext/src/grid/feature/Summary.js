/**
 * This feature is used to place a summary row at the bottom of the grid. If using a grouping,
 * see {@link Ext.grid.feature.GroupingSummary}. There are 2 aspects to calculating the summaries,
 * calculation and rendering.
 *
 * ## Calculation
 * The summary value needs to be calculated for each column in the grid. This is controlled
 * by the summaryType option specified on the column. There are several built in summary types,
 * which can be specified as a string on the column configuration. These call underlying methods
 * on the store:
 *
 *  - {@link Ext.data.Store#count count}
 *  - {@link Ext.data.Store#sum sum}
 *  - {@link Ext.data.Store#min min}
 *  - {@link Ext.data.Store#max max}
 *  - {@link Ext.data.Store#average average}
 *
 * Alternatively, the summaryType can be a function definition. If this is the case,
 * the function is called with an array of records to calculate the summary value.
 *
 * ## Rendering
 * Similar to a column, the summary also supports a summaryRenderer function. This
 * summaryRenderer is called before displaying a value. The function is optional, if
 * not specified the default calculated value is shown. The summaryRenderer is called with:
 *
 *  - value {Object} - The calculated value.
 *  - summaryData {Object} - Contains all raw summary values for the row.
 *  - field {String} - The name of the field we are calculating
 *  - metaData {Object} - A collection of metadata about the current cell; can be used or modified by the renderer.
 *
 * ## Example Usage
 *
 *     @example
 *     Ext.define('TestResult', {
 *         extend: 'Ext.data.Model',
 *         fields: ['student', {
 *             name: 'mark',
 *             type: 'int'
 *         }]
 *     });
 *
 *     Ext.create('Ext.grid.Panel', {
 *         width: 400,
 *         height: 200,
 *         title: 'Summary Test',
 *         style: 'padding: 20px',
 *         renderTo: document.body,
 *         features: [{
 *             ftype: 'summary'
 *         }],
 *         store: {
 *             model: 'TestResult',
 *             data: [{
 *                 student: 'Student 1',
 *                 mark: 84
 *             },{
 *                 student: 'Student 2',
 *                 mark: 72
 *             },{
 *                 student: 'Student 3',
 *                 mark: 96
 *             },{
 *                 student: 'Student 4',
 *                 mark: 68
 *             }]
 *         },
 *         columns: [{
 *             dataIndex: 'student',
 *             text: 'Name',
 *             summaryType: 'count',
 *             summaryRenderer: function(value, summaryData, dataIndex) {
 *                 return Ext.String.format('{0} student{1}', value, value !== 1 ? 's' : '');
 *             }
 *         }, {
 *             dataIndex: 'mark',
 *             text: 'Mark',
 *             summaryType: 'average'
 *         }]
 *     });
 */
Ext.define('Ext.grid.feature.Summary', {

    /* Begin Definitions */

    extend: 'Ext.grid.feature.AbstractSummary',

    alias: 'feature.summary',

    /**
     * @cfg {String} dock
     * Configure `'top'` or `'bottom'` top create a fixed summary row either above or below the scrollable table.
     *
     */
    dock: undefined,

    dockedSummaryCls: Ext.baseCSSPrefix + 'docked-summary',

    summaryItemCls: Ext.baseCSSPrefix + 'grid-item-summary',

    panelBodyCls: Ext.baseCSSPrefix + 'summary-',

    scrollPadProperty: 'padding-right',

    // turn off feature events.
    hasFeatureEvent: false,

    init: function(grid) {
        var me = this,
            view = me.view;

        me.callParent(arguments);

        if (me.dock) {
            grid.headerCt.on({
                add: me.onStoreUpdate,
                afterlayout: me.onStoreUpdate,
                scope: me
            });
            grid.on({
                beforerender: function() {
                    var tableCls = [me.summaryTableCls];
                    if (view.columnLines) {
                        tableCls[tableCls.length] = view.ownerCt.colLinesCls;
                    }
                    me.summaryBar = grid.addDocked({
                        childEls: ['innerCt', 'item'],
                        renderTpl: [
                            '<div id="{id}-innerCt" data-ref="innerCt" role="presentation">',
                                '<table id="{id}-item" data-ref="item" cellPadding="0" cellSpacing="0" class="' + tableCls.join(' ') + '">',
                                    '<tr class="' + me.summaryRowCls + '"></tr>',
                                '</table>',
                            '</div>'
                        ],
                        scrollable: {
                            x: false,
                            y: false
                        },
                        hidden: !me.showSummaryRow,
                        itemId: 'summaryBar',
                        cls: [ me.dockedSummaryCls, me.dockedSummaryCls + '-' + me.dock ],
                        xtype: 'component',
                        dock: me.dock,
                        weight: 10000000
                    })[0];
                },
                afterrender: function() {
                    grid.body.addCls(me.panelBodyCls + me.dock);
                    view.on('scroll', me.onViewScroll, me);
                    me.onStoreUpdate();
                },
                single: true
            });

            // Stretch the innerCt of the summary bar upon headerCt layout
            grid.headerCt.afterComponentLayout = Ext.Function.createSequence(grid.headerCt.afterComponentLayout, function() {
                var width = this.getTableWidth(),
                    innerCt = me.summaryBar.innerCt;

                me.summaryBar.item.setWidth(width);

                // "this" is the HeaderContainer. Its tooNarrow flag is set by its layout if the columns overflow.
                // Must not measure+set in after layout phase, this is a write phase.
                if (this.tooNarrow) {
                    width += Ext.getScrollbarSize().width;
                }
                innerCt.setWidth(width);
            });
        } else {
            me.view.addFooterFn(me.renderSummaryRow);
        }

        grid.on({
            beforereconfigure: me.onBeforeReconfigure,
            columnmove: me.onStoreUpdate,
            scope: me
        });
        me.bindStore(grid, grid.getStore());
    },

    onBeforeReconfigure: function(grid, store) {
        this.summaryRecord = null;
        if (store) {
            this.bindStore(grid, store);
        }
    },

    bindStore: function(grid, store) {
        var me = this;

        Ext.destroy(me.storeListeners);
        me.storeListeners = store.on({
            scope: me,
            destroyable: true,
            update: me.onStoreUpdate,
            datachanged: me.onStoreUpdate
        });
    },

    renderSummaryRow: function(values, out, parent) {
        var view = values.view,
            me = view.findFeature('summary'),
            bufferedRenderer = view.bufferedRenderer,
            record, rows;

        if (me.showSummaryRow) {
            if (bufferedRenderer) {
                rows = values.rows;
                // Render the summary if there are 0 nodes
                if (rows.length && view.getStore().last() !== rows[rows.length - 1]) {
                    return;
                }
            }
            record = me.summaryRecord;

            out.push('<table cellpadding="0" cellspacing="0" class="' +  me.summaryItemCls + '" style="table-layout: fixed; width: 100%;">');
            me.outputSummaryRecord((record && record.isModel) ? record : me.createSummaryRecord(view), values, out, parent);
            out.push('</table>');
        }
    },

    toggleSummaryRow: function(visible /* private */, fromLockingPartner) {
        var me = this,
            bar = me.summaryBar;

        me.callParent([visible, fromLockingPartner]);
        if (bar) {
            bar.setVisible(me.showSummaryRow);
            me.onViewScroll();
        }
    },

    getSummaryBar: function() {
        return this.summaryBar;
    },

    vetoEvent: function(record, row, rowIndex, e) {
        return !e.getTarget(this.summaryRowSelector);
    },

    onViewScroll: function() {
        this.summaryBar.setScrollX(this.view.getScrollX());
    },

    createSummaryRecord: function (view) {
        var me = this,
            columns = view.headerCt.getVisibleGridColumns(),
            remoteRoot = me.remoteRoot,
            summaryRecord = me.summaryRecord,
            colCount = columns.length, i, column,
            dataIndex, summaryValue, modelData;

        if (!summaryRecord) {
            modelData = {
                id: view.id + '-summary-record'
            };
            summaryRecord = me.summaryRecord = new Ext.data.Model(modelData);
        }

        // Set the summary field values
        summaryRecord.beginEdit();

        if (remoteRoot && view.store.proxy.reader.rawData) {
            summaryRecord.set(me.generateSummaryData());
        } else if (!remoteRoot) {
            for (i = 0; i < colCount; i++) {
                column = columns[i];

                // In summary records, if there's no dataIndex, then the value in regular rows must come from a renderer.
                // We set the data value in using the column ID.
                dataIndex = column.dataIndex || column.getItemId();

                // We need to capture this value because it could get overwritten when setting on the model if there
                // is a convert() method on the model.
                summaryValue = me.getSummary(view.store, column.summaryType, dataIndex);
                summaryRecord.set(dataIndex, summaryValue);

                // Capture the columnId:value for the summaryRenderer in the summaryData object.
                me.setSummaryData(summaryRecord, column.getItemId(), summaryValue);
            }
        }

        summaryRecord.endEdit(true);
        // It's not dirty
        summaryRecord.commit(true);
        summaryRecord.isSummary = true;

        return summaryRecord;
    },

    onStoreUpdate: function() {
        var me = this,
            view = me.view,
            selector = me.summaryRowSelector,
            record, newRowDom, oldRowDom, p;

        if (!view.rendered) {
            return;
        }

        record = me.createSummaryRecord(view);
        newRowDom = Ext.fly(view.createRowElement(record, -1)).down(selector, true);

        if (!newRowDom) {
            return;
        }

        // Summary row is inside the docked summaryBar Component
        if (me.dock) {
            p = me.summaryBar.item.dom.firstChild;
            oldRowDom = p.firstChild;
        }
        // Summary row is a regular row in a THEAD inside the View.
        // Downlinked through the summary record's ID'
        else {
            oldRowDom = me.view.el.down(selector, true);
            p = oldRowDom ? oldRowDom.parentNode : null;
        }

        if (p) {
            p.insertBefore(newRowDom, oldRowDom);
            p.removeChild(oldRowDom);
        }
        // If docked, the updated row will need sizing because it's outside the View
        if (me.dock) {
            me.onColumnHeaderLayout();
        }
    },

    // Synchronize column widths in the docked summary Component
    onColumnHeaderLayout: function() {
        var view = this.view,
            columns = view.headerCt.getVisibleGridColumns(),
            column,
            len = columns.length, i,
            summaryEl = this.summaryBar.el,
            el;

        for (i = 0; i < len; i++) {
            column = columns[i];
            el = summaryEl.down(view.getCellSelector(column), true);
            if (el) {
                Ext.fly(el).setWidth(column.width || (column.lastBox ? column.lastBox.width : 100));
            }
        }
    },

    destroy: function() {
        var me = this;
        me.summaryRecord = me.storeListeners = Ext.destroy(me.storeListeners);
        me.callParent();
    }
});
