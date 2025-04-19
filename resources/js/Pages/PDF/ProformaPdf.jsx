import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Color Scheme
const colors = {
    primary: '#2c3e50',      // Navy Blue
    secondary: '#27ae60',    // Green
    accent: '#e67e22',       // Orange
    lightBg: '#f8f9fa',      // Light Gray
    border: '#dfe6e9',       // Light Border
    textDark: '#2d3436',     // Dark Text
    textLight: '#636e72'     // Gray Text
};

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff'
    },
    header: {
        marginBottom: 25,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    companyInfo: {
        fontSize: 8,
        color: colors.textLight,
        lineHeight: 1.4,
        textAlign: 'right'
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 15,
        backgroundColor: colors.lightBg,
        borderRadius: 4
    },
    section: {
        marginBottom: 25
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    twoColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    column: {
        width: '48%'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    label: {
        fontSize: 9,
        color: colors.textLight,
        fontWeight: 'bold'
    },
    value: {
        fontSize: 9,
        color: colors.textDark
    },
    productSection: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden'
    },
    productHeader: {
        backgroundColor: colors.primary,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    productTitle: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold'
    },
    table: {
        width: '100%'
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: colors.lightBg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 8,
        paddingHorizontal: 5
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 8,
        paddingHorizontal: 5
    },
    col1: { width: '25%', fontSize: 9, paddingRight: 5 },
    col2: { width: '20%', fontSize: 9, paddingRight: 5 },
    col3: { width: '10%', fontSize: 9, paddingRight: 5, textAlign: 'right' },
    col4: { width: '10%', fontSize: 9, paddingRight: 5, textAlign: 'right' },
    col5: { width: '10%', fontSize: 9, paddingRight: 5, textAlign: 'right' },
    col6: { width: '15%', fontSize: 9, paddingRight: 5 },
    col7: { width: '10%', fontSize: 9, textAlign: 'right' },
    totals: {
        marginTop: 25,
        width: '35%',
        alignSelf: 'flex-end'
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
        paddingVertical: 4
    },
    grandTotal: {
        borderTopWidth: 1,
        borderColor: colors.border,
        paddingTop: 8,
        marginTop: 8
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 8,
        color: colors.textLight,
        textAlign: 'center',
        borderTopWidth: 1,
        borderColor: colors.border,
        paddingTop: 10
    },
    watermark: {
        position: 'absolute',
        opacity: 0.1,
        fontSize: 72,
        color: colors.primary,
        transform: 'rotate(-45deg)',
        left: 100,
        top: 400
    }
});


export const ProformaPdf = ({ client, data }) => {
    const proforma = data || {};
    const products = proforma.products || [];

    let grandSubtotal = 0;
    let grandTotalTax = 0;
    let grandServiceCharge = 0;

    const processedProducts = products.map(product => {
        const proformaItems = product.proformas || [];
        let productSubtotal = 0;
        let productTax = 0;
        let productServiceCharge = 0;

        const processedItems = proformaItems.map(item => {
            const quantity = parseFloat(item.count) || 0;
            const price = parseFloat(item.price) || 0;
            const taxRate = parseFloat(item.tax) || 0;
            const serviceRate = parseFloat(item.service_charge) || 0;
            const itemTotal = quantity * price;
            const itemTax = (itemTotal * taxRate) / 100;
            const itemServiceCharge = (itemTotal * serviceRate) / 100;

            productSubtotal += itemTotal;
            productTax += itemTax;
            productServiceCharge += itemServiceCharge;

            let dimensions = [];
            try {
                dimensions = JSON.parse(item.additional_description || '[]');
            } catch (_) {
                dimensions = [];
            }

            return {
                ...item,
                quantity,
                price,
                taxRate,
                serviceRate,
                itemTotal,
                itemTax,
                itemServiceCharge,
                dimensions
            };
        });

        grandSubtotal += productSubtotal;
        grandTotalTax += productTax;
        grandServiceCharge += productServiceCharge;

        return {
            ...product,
            processedItems,
            productSubtotal,
            productTax,
            productServiceCharge,
            productTotal: productSubtotal + productTax + productServiceCharge
        };
    });

    const grandTotal = grandSubtotal + grandTotalTax + grandServiceCharge;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Watermark */}
                <Text style={styles.watermark}>PROFORMA</Text>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>
                            Good Guy's Interiors
                        </Text>
                        <Text style={styles.companyInfo}>
                            Badambagh Sopore {"\n"}
                            Baramulla, Srinagar, 193201{"\n"}
                            Tel: (212) 555-1234{"\n"}
                            abc@gmail.com
                        </Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 24, fontWeight: 'black', color: colors.secondary }}>
                            PROFORMA
                        </Text>
                    </View>
                </View>

                {/* Invoice Summary */}
                <View style={styles.invoiceHeader}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Bill To:</Text>
                        <Text style={{ ...styles.value, marginBottom: 8 }}>
                            {client?.client_name || '-'}
                        </Text>
                        <Text style={styles.value}>{client?.client_address || '-'}</Text>
                        <Text style={styles.value}>
                            {client?.client_phone || '-'} | {client?.client_email || '-'}
                        </Text>
                    </View>
                    <View style={styles.column}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Proforma #:</Text>
                            <Text style={styles.value}>{proforma.proforma_number || '-'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Date:</Text>
                            <Text style={styles.value}>
                                {proforma.created_at
                                    ? new Date(proforma.created_at).toLocaleDateString()
                                    : '-'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Client Type:</Text>
                            <Text style={{ ...styles.value, color: colors.secondary }}>
                                {client?.client_type || '-'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Products Section */}
                <View style={styles.section}>
                    {processedProducts.map((product, productIndex) => (
                        <View style={styles.productSection} key={productIndex}>
                            <View style={styles.productHeader}>
                                <Text style={styles.productTitle}>{product.product_name}</Text>

                            </View>

                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.col1}>ITEM</Text>
                                    <Text style={styles.col6}>DIMENSIONS</Text>
                                    <Text style={styles.col2}>DESCRIPTION</Text>
                                    <Text style={styles.col3}>QTY</Text>
                                    <Text style={styles.col4}>PRICE</Text>
                                    <Text style={styles.col5}>TAX%</Text>
                                    <Text style={styles.col7}>TOTAL</Text>

                                </View>

                                {product.processedItems.map((item, itemIndex) => (
                                    <View
                                        style={[
                                            styles.tableRow,
                                            { backgroundColor: itemIndex % 2 === 0 ? '#fff' : colors.lightBg }
                                        ]}
                                        key={itemIndex}
                                    >
                                        <Text style={styles.col1}>{item.item_name}</Text>
                                        <Text style={styles.col6}>
                                            {item.dimensions.map((dim, i) => (
                                                <Text key={i}>
                                                    {dim.type}: {dim.value}{dim.si}
                                                    {i < item.dimensions.length - 1 ? '\n' : ''}
                                                </Text>
                                            ))}
                                        </Text>
                                        <Text style={styles.col2}>{item.description || '-'}</Text>
                                        <Text style={styles.col3}>{item.quantity}</Text>
                                        <Text style={styles.col4}>₹{item.price}</Text>
                                        <Text style={styles.col5}>{item.taxRate}%</Text>

                                        <Text style={styles.col7}>₹{item.itemTotal}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.productHeader}>
                                <Text style={{ ...styles.productTitle, }}>
                                    Total: ₹{product.productTotal}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Grand Totals */}
                <View style={styles.totals}>
                    <View style={styles.totalRow}>
                        <Text style={styles.label}>Subtotal:</Text>
                        <Text style={styles.value}>₹{grandSubtotal}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.label}>Tax:</Text>
                        <Text style={styles.value}>₹{grandTotalTax}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.label}>Service Charge:</Text>
                        <Text style={styles.value}>₹{grandServiceCharge}</Text>
                    </View>
                    <View style={[styles.totalRow, styles.grandTotal]}>
                        <Text style={{ ...styles.label, fontWeight: 'black' }}>GRAND TOTAL:</Text>
                        <Text style={{ ...styles.value, fontWeight: 'black', color: colors.secondary }}>
                            ₹{grandTotal}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>GreenLeaf Interiors - Registered VAT Number: GB123 4567 89</Text>
                    <Text>Payment Terms: Net 15 Days | Late fee of 1.5% per month on overdue balances</Text>
                    <Text>All prices include VAT where applicable | www.greenleaf.com</Text>
                </View>
            </Page>
        </Document>
    );
};