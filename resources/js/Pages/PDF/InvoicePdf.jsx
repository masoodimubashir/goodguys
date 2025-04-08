import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';




export const InvoicePdf = ({ client, data }) => {

    const styles = StyleSheet.create({
        page: { fontSize: 10, padding: 30 },
        header: {
            backgroundColor: '#163ca3',
            color: '#fff',
            padding: 10,
            textAlign: 'left',
            fontSize: 20,
            fontWeight: 'bold',
        },
        balanceDueBar: {
            backgroundColor: '#e9ecfc',
            textAlign: 'right',
            padding: 5,
            fontSize: 12,
        },
        companyInfo: {
            textAlign: 'right',
            fontSize: 8,
            marginTop: 4,
            marginBottom: 10,
        },
        section: { marginVertical: 10 },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            fontSize: 9,
            marginBottom: 4,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: '#f0f0f0',
            padding: 6,
            fontWeight: 'bold',
            fontSize: 9,
        },
        tableRow: {
            flexDirection: 'row',
            padding: 6,
            borderBottomWidth: 0.5,
            borderBottomColor: '#e0e0e0',
        },
        colNumber: { width: '5%' },
        colItem: { width: '45%' },
        colAmount: { width: '25%', textAlign: 'right' },
        colQty: { width: '25%', textAlign: 'right' },
        summary: {
            textAlign: 'right',
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            fontSize: 10,
        },
        terms: {
            marginTop: 20,
            fontSize: 8,
            color: '#444',
        }
    });


    const items = data?.invoices || []; 

    const subtotal = items.reduce((sum, item) => sum + (item.count * item.price), 0);
    const taxRate = 0.05;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <Text style={styles.header}>INVOICE</Text>

                {/* Company Info */}
                <View style={styles.companyInfo}>
                    <Text>Good Guys</Text>
                    <Text>Baramulla, Sopore</Text>
                    <Text>New York, NY 10001</Text>
                    <Text>Jammu & Kashmir</Text>
                </View>

                {/* Balance Due Section */}
                <View style={styles.balanceDueBar}>
                    <Text>BALANCE DUE Rs {total.toFixed(2)}</Text>
                </View>

                {/* Client + Invoice Info */}
                <View style={[styles.row, styles.section]}>
                    <View>
                        <Text style={{ fontWeight: 'bold' }}>{client.client_name}</Text>
                        <Text>{client.client_address}</Text>
                        <Text>{client.site_name}</Text>
                    </View>
                </View>

                {/* Table Header */}
                <View style={styles.section}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.colNumber}>#</Text>
                        <Text style={styles.colItem}>ITEM & DESCRIPTION</Text>
                        <Text style={styles.colQty}>Qty × Rate</Text>
                        <Text style={styles.colAmount}>AMOUNT</Text>
                        <Text style={styles.colAmount}>REMARK</Text>
                    </View>

                    {items.map((item, idx) => (
                        <View style={styles.tableRow} key={idx}>
                            <Text style={styles.colNumber}>{idx + 1}</Text>

                            <View style={styles.colItem}>
                                <Text>{item.item_name}</Text>
                                <Text style={{ fontSize: 8, color: '#666' }}>{item.description}</Text>
                            </View>

                            <Text style={styles.colQty}>
                                {item.count} × {item.price}
                            </Text>

                            <Text style={styles.colAmount}>
                                Rs {(item.count * item.price).toFixed(2)}
                            </Text>

                            <View style={styles.colAmount}>
                                {(() => {
                                    try {
                                        const parsed = JSON.parse(item.additional_description);
                                        return parsed.map((desc, i) => (
                                            <Text key={i} style={{ fontSize: 7 }}>
                                                {desc.type}: {desc.value} {desc.si}
                                            </Text>
                                        ));
                                    } catch (e) {
                                        return <Text style={{ fontSize: 7 }}>Invalid format</Text>;
                                    }
                                })()}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={styles.summary}>
                    <Text>Sub Total: Rs {subtotal.toFixed(2)}</Text>
                    <Text>Tax Rate: 5.00%</Text>
                    <Text style={{ fontWeight: 'bold' }}>Total: Rs {total.toFixed(2)}</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 4 }}>
                        Balance Due: Rs {total.toFixed(2)}
                    </Text>
                </View>

                {/* Terms & Conditions */}
                <View style={styles.terms}>
                    <Text>
                        Terms & Conditions: Full payment is due upon receipt of this invoice. Late payments may incur
                        additional charges or interest as per the applicable laws.
                    </Text>
                </View>
            </Page>
        </Document>
    );
};


