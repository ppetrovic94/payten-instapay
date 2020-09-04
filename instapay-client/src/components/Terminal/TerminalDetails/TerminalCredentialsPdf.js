import React from 'react';
import { Page, Document, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  credentialHeader: { textAlign: 'center', marginTop: 10, fontSize: 25 },
  credentialQrCode: { flexDirection: 'row', paddingTop: 20 },
  credentialDetails: { paddingBottom: 10 },
  credentialUserId: { flexDirection: 'row', paddingBottom: 10, paddingTop: 10 },
  credentialActivationCode: { flexDirection: 'row' },
  image: { objectFit: 'fill', width: '50%', height: '100%' },
});

const TerminalCredentialsPdf = ({ acquirerTid, activationCode, userId }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.crendentialContainer}>
        <View style={styles.credentialHeader}>
          <Text
            style={{
              fontWeight: 'bold',
            }}>{`Kredencijali - ${acquirerTid}`}</Text>
        </View>
        <View style={styles.credentialQrCode}>
          <Text>User ID (QR): </Text>
          <Image
            style={styles.image}
            source={{
              uri: `http://localhost:8080/api/user/terminals/qrcode/${userId}`,
              method: 'GET',
            }}
          />
        </View>
        <View style={styles.credentialDetails}>
          <View style={styles.credentialUserId}>
            <Text>User ID (TEXT): </Text>
            <Text style={{ paddingLeft: 5 }}>{userId}</Text>
          </View>
          <View style={styles.credentialActivationCode}>
            <Text>Aktivacioni kod: </Text>
            <Text style={{ paddingLeft: 5 }}>{activationCode}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default TerminalCredentialsPdf;
