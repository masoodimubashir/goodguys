import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Color Scheme
const colors = {
  primary: '#2c3e50', // Navy Blue
  secondary: '#27ae60', // Green
  accent: '#e67e22', // Orange
  lightBg: '#f8f9fa', // Light Gray
  border: '#dfe6e9', // Light Border
  textDark: '#2d3436', // Dark Text
  textLight: '#636e72' // Gray Text
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
    textAlign: 'left'
  },
  challanHeader: {
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
  challanSection: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden'
  },
  challanHeaderSection: {
    backgroundColor: colors.primary,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  challanTitle: {
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
  col2: { width: '35%', fontSize: 9, paddingRight: 5 },
  col3: { width: '15%', fontSize: 9, paddingRight: 5, textAlign: 'right' },
  col4: { width: '15%', fontSize: 9, paddingRight: 5, textAlign: 'right' },
  col5: { width: '10%', fontSize: 9, textAlign: 'right' },
  totals: {
    marginTop: 15,
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
  },
  serviceChargeRow: {
    backgroundColor: colors.lightBg,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  summarySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.lightBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  }
});

const ChallanToPdf = ({ client, challans, company_profile }) => {


  // Calculate totals across all challans
  let combinedSubtotal = 0;
  let combinedServiceCharge = 0;
  let combinedTotal = 0;

  const processedChallans = challans.map(challan => {
    const items = challan.challans || [];
    const serviceCharge = parseFloat(challan.service_charge) || 0;
    const hasVisiblePrices = items.some(item => item.is_price_visible);

    let challanSubtotal = 0;
    const processedItems = items.map(item => {
      const quantity = parseFloat(item.unit_count) || 0;
      const price = parseFloat(item.price) || 0;
      const itemTotal = quantity * price;
      const is_price_visible = item.is_price_visible;

      if (is_price_visible) {
        challanSubtotal += itemTotal;
      }

      return {
        ...item,
        quantity,
        price,
        itemTotal,
        is_price_visible
      };
    });

    const serviceChargeAmount = (challanSubtotal * serviceCharge / 100);
    const challanTotal = challanSubtotal + serviceChargeAmount;

    if (hasVisiblePrices) {
      combinedSubtotal += challanSubtotal;
      combinedServiceCharge += serviceChargeAmount;
      combinedTotal += challanTotal;
    }

    return {
      ...challan,
      processedItems,
      hasVisiblePrices,
      challanSubtotal,
      serviceChargeAmount,
      challanTotal
    };
  });

  const showPrices = processedChallans.some(challan => challan.hasVisiblePrices);

  return (

    <Document>

      <Page size="A4" style={styles.page}>

        {/* Watermark */}
        <Text style={styles.watermark}>
          {company_profile?.company_name || 'Company Name'}
        </Text>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>
              {company_profile?.company_name || 'Company Name'}
            </Text>
            <Text style={styles.companyInfo}>
              Invoice {"\n"}
              Contact: {company_profile?.company_contact_no || '-'} {"\n"}
              Email: {company_profile?.company_email || '-'}
              Address: {company_profile?.company_address || '-'}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'black', color: colors.secondary }}>Invoice</Text>
          </View>
        </View>


        {/* Client Summary */}
        <View style={styles.challanHeader}>
          <View style={styles.column}>
            <Text style={styles.label}>Deliver To:</Text>
            <Text style={{ ...styles.value, marginBottom: 8 }}>{client?.client_name || '-'}</Text>
            <Text style={styles.value}>{client?.client_address || '-'}</Text>
            <Text style={styles.value}>{client?.client_phone || '-'} | {client?.client_email || '-'}</Text>
          </View>
          <View style={styles.column}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Report Date:</Text>
              <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Client Type:</Text>
              <Text style={{ ...styles.value, color: colors.secondary }}>{client?.client_type || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Total Challans:</Text>
              <Text style={styles.value}>{challans.length}</Text>
            </View>
          </View>
        </View>



        {/* Individual Challan Sections */}
        {processedChallans.map((challan, index) => (
          <View key={challan.id} style={styles.section}>
            <View style={styles.challanSection}>
              <View style={styles.challanHeaderSection}>
                <Text style={styles.challanTitle}>
                  Challan #{index + 1}: {challan.challan_number || 'N/A'} • Date: {new Date(challan.created_at).toLocaleDateString()}
                </Text>
                {challan.hasVisiblePrices && (
                  <Text style={styles.challanTitle}>
                    Service Charge: {challan.service_charge}%
                  </Text>
                )}
              </View>

              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.col1}>ITEM NAME</Text>
                  <Text style={styles.col2}>DESCRIPTION</Text>
                  <Text style={styles.col3}>QUANTITY</Text>
                  {challan.hasVisiblePrices && (
                    <>
                      <Text style={styles.col4}>PRICE</Text>
                      <Text style={styles.col5}>TOTAL</Text>
                    </>
                  )}
                </View>

                {challan.processedItems.map((item, itemIndex) => (
                  <View
                    style={[
                      styles.tableRow,
                      { backgroundColor: itemIndex % 2 === 0 ? '#fff' : colors.lightBg }
                    ]}
                    key={itemIndex}
                  >
                    <Text style={styles.col1}>{item.item_name}</Text>
                    <Text style={styles.col2}>{item.description || '-'}</Text>
                    <Text style={styles.col3}>{item.quantity}</Text>
                    {item.is_price_visible && challan.hasVisiblePrices && (
                      <>
                        <Text style={styles.col4}>₹{item.price.toFixed(2)}</Text>
                        <Text style={styles.col5}>₹{item.itemTotal.toFixed(2)}</Text>
                      </>
                    )}
                  </View>
                ))}
              </View>

              {challan.hasVisiblePrices && (
                <>
                  <View style={styles.serviceChargeRow}>
                    <Text style={styles.label}>Subtotal:</Text>
                    <Text style={styles.value}>₹{challan.challanSubtotal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.serviceChargeRow}>
                    <Text style={styles.label}>Service Charge ({challan.service_charge}%):</Text>
                    <Text style={styles.value}>₹{challan.serviceChargeAmount.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.serviceChargeRow, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.label, { color: 'white', fontWeight: 'bold' }]}>Challan Total:</Text>
                    <Text style={[styles.value, { color: 'white', fontWeight: 'bold' }]}>₹{challans.length.toFixed(2)}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        ))}

        {/* Combined Summary */}
        {showPrices && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>COMBINED SUMMARY</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Total Subtotal:</Text>
              <Text style={styles.value}>₹{combinedSubtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Total Service Charges:</Text>
              <Text style={styles.value}>₹{combinedServiceCharge.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, { marginTop: 10 }]}>
              <Text style={{ ...styles.label, fontWeight: 'black' }}>GRAND TOTAL:</Text>
              <Text style={{ ...styles.value, fontWeight: 'black', color: colors.secondary }}>
                ₹{combinedTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Combined Delivery Challan - Includes {challans.length} challan(s)</Text>
          <Text>Receiver's Signature: _________________ Date: _________</Text>
        </View>

      </Page>
    </Document>
  );
};

export default ChallanToPdf;