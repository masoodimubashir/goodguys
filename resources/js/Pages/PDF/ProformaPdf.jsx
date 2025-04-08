import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
    page: { padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    companyInfo: { fontSize: 10, marginBottom: 10 },
    invoiceDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        fontSize: 10,
    },
    table: { marginTop: 20 },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tableCell: { paddingVertical: 2 },
    col1: { width: '30%', fontSize: 8 },
    col2: { width: '35%', fontSize: 8 },
    col3: { width: '15%', fontSize: 8 },
    col4: { width: '20%', fontSize: 8 },
    footer: { marginTop: 30, fontSize: 10 },
});

export const ProformaPdf = ({ client, data }) => {

    const items = data?.proformas || []; 

    // Subtotal calculation using count * price
    const subtotal = items.reduce((sum, item) => {
        const count = parseFloat(item.count) || 0;
        const price = parseFloat(item.price) || 0;
        return sum + count * price;
    }, 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>PROFORMA INVOICE</Text>
                    <Text style={styles.companyInfo}>
                        Good Guys Company{'\n'}
                        123 Business Street{'\n'}
                        City, Country 12345
                    </Text>
                </View>

                {/* Client Info */}
                <View style={styles.invoiceDetails}>
                    <View>
                        <Text>Bill To:</Text>
                        <Text>{client.client_name}</Text>
                        <Text>{client.client_address}</Text>
                        <Text>{client.client_email}</Text>
                        <Text>{client.client_phone}</Text>
                        <Text>Site: {client.site_name}</Text>
                    </View>
                </View>

                {/* Table Header */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <View style={styles.col1}><Text>Item</Text></View>
                        <View style={styles.col3}><Text>Count</Text></View>
                        <View style={styles.col4}><Text>Total</Text></View>
                        <View style={styles.col2}><Text>Description</Text></View>
                    </View>

                    {/* Table Rows */}
                    {items.map((item, index) => {
                        const count = parseFloat(item.count) || 0;
                        const price = parseFloat(item.price) || 0;
                        const total = count * price;
                        return (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.col1}><Text>{item.item_name}</Text></View>
                                <View style={styles.col3}><Text>{count}</Text></View>
                                <View style={styles.col4}><Text>{total.toFixed(2)}</Text></View>
                                <View style={styles.col2}><Text>{item.description}</Text></View>
                            </View>
                        );
                    })}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Subtotal: Rs {subtotal.toFixed(2)}</Text>
                    <Text style={{ marginTop: 10 }}>Thank you for your business!</Text>
                </View>
            </Page>
        </Document>
    );
};
