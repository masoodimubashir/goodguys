import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Constants
const COLORS = {
  primary: '#2c3e50',
  secondary: '#27ae60',
  accent: '#e67e22',
  lightBg: '#f8f9fa',
  border: '#dfe6e9',
  textDark: '#2d3436',
  textLight: '#636e72',
};

const FONT_SIZES = {
  small: 8,
  medium: 9,
  large: 10,
  xlarge: 12,
  xxlarge: 20,
  title: 28,
};

// Styles (same as your existing styles, shortened here for brevity)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    opacity: 0.05,
    fontSize: 60,
    color: COLORS.primary,
    transform: 'rotate(-45deg)',
    left: 150,
    top: 400,
    zIndex: -1,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  logo: { width: 60, height: 60, marginRight: 10 },
  companyInfo: { flex: 1 },
  companyName: { fontSize: FONT_SIZES.xxlarge, fontWeight: 'bold', color: COLORS.primary },
  label: { fontSize: FONT_SIZES.medium, color: COLORS.textLight, fontWeight: 'bold' },
  value: { fontSize: FONT_SIZES.medium, color: COLORS.textDark },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  col: { fontSize: FONT_SIZES.small },
  footer: {
    marginTop: 30,
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    textAlign: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 10,
  },
});

// Component
const ChallanToInvoice = ({ company_profile, challans, client, bankAccount }) => {
  const currentDate = new Date().toLocaleDateString();

  const allItems = challans.flatMap(c => c.challans || []).filter(i => i.is_credited === 0);
  const hasPrices = allItems.some(i => i.is_price_visible);

  let inTotal = 0, outTotal = 0, subtotal = 0;

  const items = allItems.map((item, index) => {
    const quantity = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    const total = quantity > 1 ? quantity * price : price;

    if (item.unit_type === 'in') inTotal += total;
    else if (item.unit_type === 'out') outTotal += total;

    if (item.is_price_visible) subtotal += total;

    return {
      ...item,
      index: index + 1,
      quantity,
      price,
      total,
    };
  });

  const serviceCharge = parseFloat(challans[0]?.service_charge) || 0;
  const serviceChargeAmount = outTotal * serviceCharge / 100;
  const outWithService = outTotal + serviceChargeAmount;
  const remainingBalance = inTotal - outWithService;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>CHALLAN</Text>

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row' }}>
            {company_profile?.logo && <Image src={`/storage/${company_profile?.logo}`} style={styles.logo} />}
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{company_profile?.company_name ?? 'NA'}</Text>
              <Text style={styles.value}>{company_profile?.company_address ?? 'NA'}</Text>
              <Text style={styles.value}>Phone: {company_profile?.company_contact_no ?? 'NA'}</Text>
              <Text style={styles.value}>Email: {company_profile?.company_email ?? 'NA'}</Text>
            </View>
          </View>
          <Text style={[styles.companyName, { fontSize: FONT_SIZES.title, color: COLORS.secondary }]}>INVOICE</Text>
        </View>

        {/* Client Info */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.label, { fontSize: FONT_SIZES.large }]}>Deliver To:</Text>
          <Text style={[styles.value, { fontWeight: 'bold' }]}>{client.client_name}</Text>
          <Text style={styles.value}>{client.client_address}</Text>
          <Text style={styles.value}>Phone: {client.client_phone}</Text>
          <Text style={styles.value}>Email: {client.client_email}</Text>
          <Text style={[styles.value, { marginTop: 5 }]}>Site: {client.site_name}</Text>
        </View>

        {/* Table */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.col, { width: '8%', color: '#fff' }]}>S.No</Text>
            <Text style={[styles.col, { width: '25%', color: '#fff' }]}>Description</Text>
            <Text style={[styles.col, { width: '12%', color: '#fff' }]}>Unit</Text>
            <Text style={[styles.col, { width: '10%', color: '#fff', textAlign: 'right' }]}>Qty</Text>
            {hasPrices && (
              <>
                <Text style={[styles.col, { width: '12%', color: '#fff', textAlign: 'right' }]}>Price</Text>
                <Text style={[styles.col, { width: '12%', color: '#fff', textAlign: 'right' }]}>Total</Text>
              </>
            )}
            <Text style={[styles.col, { width: '21%', color: '#fff' }]}>Remarks</Text>
          </View>

          {items.map((item, idx) => (
            <View key={idx} style={[styles.tableRow, { backgroundColor: idx % 2 ? COLORS.lightBg : '#fff' }]}>
              <Text style={[styles.col, { width: '8%' }]}>{item.index}</Text>
              <Text style={[styles.col, { width: '25%' }]}>{item.description}</Text>
              <Text style={[styles.col, { width: '12%' }]}>{item.unit_type}</Text>
              <Text style={[styles.col, { width: '10%', textAlign: 'right' }]}>{item.quantity}</Text>
              {hasPrices && (
                <>
                  <Text style={[styles.col, { width: '12%', textAlign: 'right' }]}>₹{item.price}</Text>
                  <Text style={[styles.col, { width: '12%', textAlign: 'right' }]}>₹{item.total.toFixed(2)}</Text>
                </>
              )}
              <Text style={[styles.col, { width: '21%' }]}>{item.narration || '-'}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        {hasPrices && (
          <View style={{ marginTop: 20 }}>
            <View style={styles.tableHeader}>
              <Text style={[styles.col, { width: '70%', color: '#fff', textAlign: 'right' }]}>BALANCE SUMMARY</Text>
              <Text style={[styles.col, { width: '30%', color: '#fff', textAlign: 'right' }]}>Amount (₹)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.col, { width: '70%', textAlign: 'right' }]}>Total IN:</Text>
              <Text style={[styles.col, { width: '30%', textAlign: 'right' }]}>{inTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.col, { width: '70%', textAlign: 'right' }]}>Total OUT + Service ({serviceCharge}%):</Text>
              <Text style={[styles.col, { width: '30%', textAlign: 'right' }]}>{outWithService.toFixed(2)}</Text>
            </View>
            <View style={[styles.tableRow, { backgroundColor: COLORS.accent }]}>
              <Text style={[styles.col, { width: '70%', color: '#fff', textAlign: 'right' }]}>Remaining Balance:</Text>
              <Text style={[styles.col, { width: '30%', color: '#fff', textAlign: 'right' }]}>{remainingBalance.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* Bank Account Info */}
        {bankAccount && (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.label, { fontSize: FONT_SIZES.large }]}>Bank Details:</Text>
            <Text style={styles.value}>Bank Name: {bankAccount.bank_name}</Text>
            <Text style={styles.value}>A/C Number: {bankAccount.account_number}</Text>
            <Text style={styles.value}>IFSC: {bankAccount.ifsc_code}</Text>
            <Text style={styles.value}>Branch: {bankAccount.branch}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated on {currentDate} | {company_profile?.company_name ?? 'NA'}</Text>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ChallanToInvoice;
