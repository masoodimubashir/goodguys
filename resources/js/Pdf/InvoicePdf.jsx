import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    companyInfo: {
        fontSize: 10,
        marginBottom: 10,
    },
    invoiceDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        fontSize: 10,
    },
    table: {
        marginTop: 20,
    },
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
    tableCell: {
        paddingVertical: 2,
    },

    col1: {
        width: '40%',
        fontSize: 8,
    },
    col2: {
        width: '20%',
        fontSize: 8,
    },
    col3: {
        width: '20%',
        fontSize: 8,
    },
    col4: {
        width: '20%',
        fontSize: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
    },
});

import React from 'react'

export const InvoicePdf = () => {
    return (
        <>
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <Text style={styles.title}>INVOICE</Text>
                        <Text style={styles.companyInfo}>
                            Good Guys Company
                            {'\n'}
                            123 Business Street
                            {'\n'}
                            City, Country 12345
                        </Text>
                    </View>

                    <View style={styles.invoiceDetails}>
                        <View>
                            <Text>Bill To:</Text>
                            <Text>Client Name</Text>
                            <Text>Client Address</Text>
                        </View>
                        <View>
                            <Text>Invoice #: INV-001</Text>
                            <Text>Date: {new Date().toLocaleDateString()}</Text>
                            <Text>Due Date: {new Date().toLocaleDateString()}</Text>
                        </View>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <View style={styles.col1}>
                                <Text style={styles.tableCell}>SNo</Text>
                            </View>
                            <View style={styles.col1}>
                                <Text style={styles.tableCell}>Works And Items</Text>
                            </View>
                            <View style={styles.col2}>
                                <Text style={styles.tableCell}>Rate</Text>
                            </View>
                            <View style={styles.col3}>
                                <Text style={styles.tableCell}>Quantity</Text>
                            </View>
                            <View style={styles.col4}>
                                <Text style={styles.tableCell}>Cost</Text>
                            </View>
                            <View style={styles.col4}>
                                <Text style={styles.tableCell}>Remarks</Text>
                            </View>
                        </View>

                        <View style={styles.tableRow}>
                            <View style={styles.col1}>
                                <Text style={styles.tableCell}>1</Text>
                            </View>
                            <View style={styles.col1}>
                                <Text style={styles.tableCell}>Kitchen Equipments</Text>
                            </View>
                            <View style={styles.col2}>
                                <Text style={styles.tableCell}>...</Text>
                            </View>
                            <View style={styles.col3}>
                                <Text style={styles.tableCell}>...</Text>
                            </View>
                            <View style={styles.col4}>
                                <Text style={styles.tableCell}>Rs 2,95,900</Text>
                            </View>
                            <View style={styles.col4}>
                                {['ABC', 'ABC', 'ABC', 'ABC', 'ABC', 'ABC', 'ABC'].map((item, index) => (
                                    <Text key={index} style={styles.tableCell}>
                                        {`${index + 1}. ${item}`}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text>Total Amount: $100.00</Text>
                        <Text>Thank you for your business!</Text>
                    </View>
                </Page>
            </Document>
        </>
    )
}

