import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

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
  },
  bankImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  bankImageWrapper: {
    width: '32%',
    alignItems: 'center'
  },
  bankImageLabel: {
    fontSize: 8,
    marginBottom: 4
  },
  bankImage: {
    width: 60,
    height: 60
  },
  signatureImage: {
    width: 60,
    height: 30
  }
});

export const ProformaPdf = ({ client, CompanyProfile, data }) => {

  
  const proforma = data || {};
  const products = proforma.products || [];
  const bankAccount = client?.bank_account || null;
  
  let grandSubtotal = 0;
  let grandTotalTax = 0;
  let grandServiceCharge = 0;

  const processedProducts = products.map(product => {
    const proformaItems = product.proformas || [];
    let productSubtotal = 0;
    let productTax = 0;
    let productServiceCharge = 0;

    const hasVisiblePrices = proformaItems.some(item => item.is_price_visible);

    const processedItems = proformaItems.map(item => {
      const quantity = parseFloat(item.count) || 0;
      const price = parseFloat(item.price) || 0;
      const taxRate = parseFloat(item.tax) || 0;
      const serviceRate = parseFloat(item.service_charge) || 0;
      const itemTotal = quantity * price;
      const itemTax = (itemTotal * taxRate) / 100;
      const itemServiceCharge = (itemTotal * serviceRate) / 100;
      const is_price_visible = item.is_price_visible;

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
        dimensions,
        is_price_visible
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
      productTotal: productSubtotal + productTax + productServiceCharge,
      hasVisiblePrices
    };
  });

  const grandTotal = grandSubtotal + grandTotalTax + grandServiceCharge;
  const showPrices = processedProducts.some(product => product.hasVisiblePrices);

  return (
    <Document>
      {/* First Page - Main Proforma Content */}
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>PROFORMA</Text>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>{CompanyProfile.company_name}</Text>
            <Text style={styles.companyInfo}>
              {CompanyProfile.company_address} {"\n"}
              {CompanyProfile.company_contact_no} {"\n"}
              {CompanyProfile.company_email}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'black', color: colors.secondary }}>PROFORMA</Text>
          </View>
        </View>

        {/* Proforma Summary */}
        <View style={styles.invoiceHeader}>
          <View style={styles.column}>
            <Text style={styles.label}>Bill To:</Text>
            <Text style={{ ...styles.value, marginBottom: 8 }}>{client?.client_name || '-'}</Text>
            <Text style={styles.value}>{client?.client_address || '-'}</Text>
            <Text style={styles.value}>{client?.client_phone || '-'} | {client?.client_email || '-'}</Text>
          </View>
          <View style={styles.column}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Proforma #:</Text>
              <Text style={styles.value}>{proforma.proforma_number || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>
                {proforma.created_at ? new Date(proforma.created_at).toLocaleDateString() : '-'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Client Type:</Text>
              <Text style={{ ...styles.value, color: colors.secondary }}>{client?.client_type || '-'}</Text>
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
                  {product.hasVisiblePrices && (
                    <>
                      <Text style={styles.col4}>PRICE</Text>
                      <Text style={styles.col5}>TAX%</Text>
                      <Text style={styles.col7}>TOTAL</Text>
                    </>
                  )}
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
                    {item.is_price_visible && product.hasVisiblePrices && (
                      <>
                        <Text style={styles.col4}>₹{item.price}</Text>
                        <Text style={styles.col5}>{item.taxRate}%</Text>
                        <Text style={styles.col7}>₹{item.itemTotal}</Text>
                      </>
                    )}
                  </View>
                ))}
              </View>
              <View style={styles.productHeader}>
                <Text style={styles.productTitle}>Total: ₹{product.productTotal}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Grand Totals */}
        {showPrices && (
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
        )}

        {/* Footer for first page */}
        <View style={styles.footer}>
          <Text>Page 1 of 2</Text>
        </View>
      </Page>

      {/* Second Page - Bank Details */}
      <Page size="A4" style={styles.page}>
        {/* Header for second page */}
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>{CompanyProfile.company_name}</Text>
            <Text style={styles.companyInfo}>
              Proforma #: {proforma.proforma_number || '-'}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'black', color: colors.secondary }}>BANK DETAILS</Text>
          </View>
        </View>

        {/* Bank Account Details Section */}
        {bankAccount && (
          <View style={[styles.section, { marginBottom: 15, padding: 10, backgroundColor: colors.lightBg, borderRadius: 4 }]}>
            <Text style={styles.sectionTitle}>Bank Account Information</Text>
            
            <View style={styles.twoColumn}>
              <View style={styles.column}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Bank Name:</Text>
                  <Text style={styles.value}>{bankAccount.bank_name || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Account Holder:</Text>
                  <Text style={styles.value}>{bankAccount.holder_name || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Account Number:</Text>
                  <Text style={styles.value}>{bankAccount.account_number || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>IFSC Code:</Text>
                  <Text style={styles.value}>{bankAccount.ifsc_code || '-'}</Text>
                </View>
              </View>
              
              <View style={styles.column}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Branch Code:</Text>
                  <Text style={styles.value}>{bankAccount.branch_code || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>SWIFT Code:</Text>
                  <Text style={styles.value}>{bankAccount.swift_code || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>UPI Details:</Text>
                  <Text style={styles.value}>
                    {bankAccount.upi_number || '-'} {bankAccount.upi_address ? `(${bankAccount.upi_address})` : ''}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Tax Number:</Text>
                  <Text style={styles.value}>{bankAccount.tax_number || '-'}</Text>
                </View>
              </View>
            </View>
            
            {/* Images Row */}
            {(bankAccount.qr_code_image || bankAccount.signiture_image || bankAccount.company_stamp_image) && (
              <View style={styles.bankImagesContainer}>
                {bankAccount.qr_code_image && (
                  <View style={styles.bankImageWrapper}>
                    <Text style={styles.bankImageLabel}>QR Code</Text>
                    <Image 
                      src={`/storage/${bankAccount.qr_code_image}`} 
                      style={styles.bankImage} 
                    />
                  </View>
                )}
                
                {bankAccount.signiture_image && (
                  <View style={styles.bankImageWrapper}>
                    <Text style={styles.bankImageLabel}>Signature</Text>
                    <Image 
                      src={`/storage/${bankAccount.signiture_image}`} 
                      style={styles.signatureImage} 
                    />
                  </View>
                )}
                
                {bankAccount.company_stamp_image && (
                  <View style={styles.bankImageWrapper}>
                    <Text style={styles.bankImageLabel}>Company Stamp</Text>
                    <Image 
                      src={`/storage/${bankAccount.company_stamp_image}`} 
                      style={styles.bankImage} 
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Payment Terms Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Terms</Text>
          <Text style={{ fontSize: 10, lineHeight: 1.5 }}>
            - This proforma invoice is valid for 30 days from the date of issue
            {"\n"}
            - Payment expected within 15 days of invoice date
            {"\n"}
            - Late payments subject to 1.5% monthly interest
            {"\n"}
            - Please include proforma number in all payments
            {"\n"}
            - Prices are subject to change without notice
          </Text>
        </View>

        {/* Footer for second page */}
        <View style={styles.footer}>
          <Text>{CompanyProfile.company_name} - Registered VAT Number: {CompanyProfile.tax_number || 'Not Provided'}</Text>
          <Text>All prices include VAT where applicable | {CompanyProfile.website || 'No website'}</Text>
          <Text>Page 2 of 2</Text>
        </View>
      </Page>
    </Document>
  );
};