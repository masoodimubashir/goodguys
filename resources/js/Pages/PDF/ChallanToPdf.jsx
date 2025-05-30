





import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Color Scheme (unchanged)
const colors = {
  primary: '#2c3e50',
  secondary: '#3498db',
  accent: '#e67e22',
  lightBg: '#f8f9fa',
  border: '#dfe6e9',
  textDark: '#2d3436',
  textLight: '#636e72'
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    position: 'relative'
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15
  },
  companyInfo: {
    flex: 1
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5
  },
  companyDetails: {
    fontSize: 9,
    color: colors.textLight,
    lineHeight: 1.4
  },
  challanTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'right'
  },
  challanInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.lightBg,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  table: {
    width: '100%',
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 5
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 5,
    minHeight: 25
  },
  col1: { width: '8%', fontSize: 8, paddingRight: 3, color: 'white' },
  col2: { width: '25%', fontSize: 8, paddingRight: 3, color: 'white' },
  col3: { width: '12%', fontSize: 8, paddingRight: 3, color: 'white' },
  col4: { width: '10%', fontSize: 8, paddingRight: 3, textAlign: 'right', color: 'white' },
  col5: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'right', color: 'white' },
  col6: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'right', color: 'white' },
  col7: { width: '21%', fontSize: 8, color: 'white' },
  dataCol1: { width: '8%', fontSize: 8, paddingRight: 3 },
  dataCol2: { width: '25%', fontSize: 8, paddingRight: 3 },
  dataCol3: { width: '12%', fontSize: 8, paddingRight: 3 },
  dataCol4: { width: '10%', fontSize: 8, paddingRight: 3, textAlign: 'right' },
  dataCol5: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'right' },
  dataCol6: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'right' },
  dataCol7: { width: '21%', fontSize: 8 },
  totalsSection: {
    padding: 10,
    backgroundColor: colors.lightBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginBottom: 20
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingVertical: 2
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 6
  },
  bankDetailsSection: {
    marginTop: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.lightBg
  },
  bankDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  bankDetailsColumn: {
    width: '48%'
  },
  bankInfoItem: {
    flexDirection: 'row',
    marginBottom: 4
  },
  bankInfoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    width: '40%',
    color: colors.textLight
  },
  bankInfoValue: {
    fontSize: 9,
    width: '60%',
    color: colors.textDark
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  signatureBox: {
    width: '45%',
    textAlign: 'center'
  },
  signatureImage: {
    width: 100,
    height: 50,
    marginBottom: 5
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 5
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
    opacity: 0.05,
    fontSize: 60,
    color: colors.primary,
    transform: 'rotate(-45deg)',
    left: 150,
    top: 400,
    zIndex: -1
  }
});

const Header = ({ company_profile }) => (
  <View style={styles.header}>
    <View style={styles.logoSection}>
      {company_profile?.logo && (
        <Image style={styles.logo} src={`/storage/${company_profile.logo}`} />
      )}
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>
          {company_profile?.company_name || 'Company Name'}
        </Text>
        <Text style={styles.companyDetails}>
          {company_profile?.company_address || 'Company Address'}{'\n'}
          Phone: {company_profile?.company_contact_no || 'N/A'}{'\n'}
          Email: {company_profile?.company_email || 'N/A'}
        </Text>
      </View>
    </View>
    <View>
      <Text style={styles.challanTitle}>Invoice</Text>
    </View>
  </View>
);

const BankDetails = ({ bankAccount }) => {
  if (!bankAccount) return null;

  return (
    <View style={styles.bankDetailsSection}>
      <Text style={styles.sectionTitle}>Bank Details</Text>
      <View style={styles.bankDetailsRow}>
        <View style={styles.bankDetailsColumn}>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>Bank Name:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.bank_name}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>Account Number:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.account_number}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>IFSC Code:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.ifsc_code}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>Branch Code:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.branch_code}</Text>
          </View>
        </View>
        <View style={styles.bankDetailsColumn}>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>Account Holder:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.holder_name}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>UPI ID:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.upi_address}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>SWIFT Code:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.swift_code}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>Tax Number:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.tax_number}</Text>
          </View>
        </View>
      </View>
      {bankAccount.qr_code_image && (
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Image
            style={{ width: 100, height: 100 }}
            src={`/storage/${bankAccount.qr_code_image}`}
          />
          <Text style={{ fontSize: 8, marginTop: 5 }}>Scan to Pay</Text>
        </View>
      )}
    </View>
  );
};

const SignatureSection = ({ bankAccount }) => (
  <View style={styles.signatureSection}>
    <View style={styles.signatureBox}>
      {bankAccount?.signiture_image && (
        <Image
          style={styles.signatureImage}
          src={`/storage/${bankAccount.signiture_image}`}
        />
      )}
      <Text style={styles.signatureLine}>Authorized Signature</Text>
    </View>
    <View style={styles.signatureBox}>
      {bankAccount?.company_stamp_image && (
        <Image
          style={styles.signatureImage}
          src={`/storage/${bankAccount?.company_stamp_image}`}
        />
      )}
      <Text style={styles.signatureLine}>Company Stamp</Text>
    </View>
  </View>
);

const ChallanPdf = ({ company_profile, client, challans }) => {
  const currentDate = new Date().toLocaleDateString();

  const processedReferences = challans.map(reference => {
    const items = reference.challans || [];
    const serviceCharge = parseFloat(reference.service_charge) || 0;

    let subtotal = 0;
    const processedItems = items.map((item, index) => {
      const quantity = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      const itemTotal = quantity > 0 ? (quantity * price) : price;

      if (item.is_price_visible) {
        subtotal += itemTotal;
      }

      return {
        ...item,
        serialNo: index + 1,
        quantity,
        price,
        itemTotal,
        formattedPrice: price.toFixed(2),
        formattedTotal: itemTotal.toFixed(2)
      };
    });

    const serviceChargeAmount = (subtotal * serviceCharge / 100);
    const total = subtotal + serviceChargeAmount;

    return {
      ...reference,
      processedItems,
      subtotal,
      serviceChargeAmount,
      total,
      formattedDate: new Date(reference.created_at).toLocaleDateString(),
      challanNumber: reference.challan_number || `CH-${reference.id}`
    };
  });

  const showPrices = processedReferences.some(ref =>
    ref.processedItems.some(item => item.is_price_visible)
  );

  return (
    <Document>
      {/* Challan Pages */}
      {processedReferences.map((reference, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <Text style={styles.watermark}>Invoice</Text>

          {index === 0 && <Header company_profile={company_profile} />}

          <Text style={[styles.value, { textAlign: 'right', fontSize: 10, marginBottom: 10 }]}>
            No: {reference.challanNumber}
          </Text>

          <View style={styles.challanInfo}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Deliver To:</Text>
              <Text style={[styles.value, { fontSize: 11, marginBottom: 3, fontWeight: 'bold' }]}>
                {client?.client_name || 'Client Name'}
              </Text>
              <Text style={styles.value}>{client?.client_address || 'Client Address'}</Text>
              <Text style={styles.value}>
                Phone: {client?.client_phone || 'N/A'}
              </Text>
              <Text style={styles.value}>
                Email: {client?.client_email || 'N/A'}
              </Text>
            </View>
            <View style={styles.column}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Challan Date:</Text>
                <Text style={styles.value}>{reference.formattedDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Reference No:</Text>
                <Text style={styles.value}>{reference.reference_number || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Prepared By:</Text>
                <Text style={styles.value}>{company_profile?.company_name || 'Company'}</Text>
              </View>
              {showPrices && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Service Charge:</Text>
                  <Text style={styles.value}>{reference.service_charge || 0}%</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>S.No</Text>
              <Text style={styles.col2}>DESCRIPTION</Text>
              <Text style={styles.col3}>UNIT TYPE</Text>
              <Text style={styles.col4}>QTY</Text>
              {showPrices && (
                <>
                  <Text style={styles.col5}>PRICE</Text>
                  <Text style={styles.col6}>TOTAL</Text>
                </>
              )}
              <Text style={styles.col7}>REMARKS</Text>
            </View>

            {reference.processedItems.map((item, itemIndex) => (
              <View
                style={[
                  styles.tableRow,
                  { backgroundColor: itemIndex % 2 === 0 ? '#fff' : colors.lightBg }
                ]}
                key={itemIndex}
              >
                <Text style={styles.dataCol1}>{item.serialNo}</Text>
                <Text style={styles.dataCol2}>{item.description || '-'}</Text>
                <Text style={styles.dataCol3}>{item.unit_type || '-'}</Text>
                <Text style={styles.dataCol4}>{item.quantity}</Text>
                {item.is_price_visible && showPrices && (
                  <>
                    <Text style={styles.dataCol5}>₹{item.formattedPrice}</Text>
                    <Text style={styles.dataCol6}>₹{item.formattedTotal}</Text>
                  </>
                )}
                <Text style={styles.dataCol7}>{item.narration || '-'}</Text>
              </View>
            ))}
          </View>

          {showPrices && (
            <View style={styles.totalsSection}>
              <View style={styles.totalRow}>
                <Text style={styles.label}>Subtotal:</Text>
                <Text style={styles.value}>₹{reference.subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.label}>Service Charge ({reference.service_charge}%):</Text>
                <Text style={styles.value}>₹{reference.serviceChargeAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.grandTotalRow}>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>Total Amount:</Text>
                <Text style={[styles.value, { fontWeight: 'bold', color: colors.secondary }]}>
                  ₹{reference.total.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Text>Challan generated on {currentDate} | {company_profile?.company_name || 'Company Name'}</Text>
            <Text>Thank you for your business!</Text>
          </View>
        </Page>
      ))}

      {/* Separate Page for Bank Details and Signatures */}
      {client.bank_account && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.watermark}>BANK DETAILS</Text>

          <View style={{ marginTop: 40 }}>
            <Text style={[styles.companyName, { textAlign: 'center', marginBottom: 30 }]}>
              Bank Details & Authorization
            </Text>

            <BankDetails bankAccount={client.bank_account} />
            <SignatureSection bankAccount={client.bank_account} />
          </View>

          <View style={styles.footer}>
            <Text>Challan generated on {currentDate} | {company_profile?.company_name || 'Company Name'}</Text>
            <Text>Thank you for your business!</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default ChallanPdf;