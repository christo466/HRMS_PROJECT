import  { useState } from 'react';
import VCF from 'vcf';
import QRCode from 'qrcode.react';

const employee = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
};

const generateVcfData = (employee) => {
  const vcard = new VCF();
  vcard.set('version', '3.0');
  vcard.set('fn', `${employee.firstName} ${employee.lastName}`);
  vcard.set('email', employee.email);
  vcard.set('tel', employee.phone);
  vcard.set('n', [employee.lastName, employee.firstName]); 
  return vcard.toString();
};

const downloadVcf = (vcfData) => {
  const blob = new Blob([vcfData], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'employee.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const EmployeeVcfDownload = () => {
  const [vcfData, setVcfData] = useState('');

  const generateVcfAndUrl = () => {
    const employeeVcfData = generateVcfData(employee);
    setVcfData(employeeVcfData);
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>Employee VCF Download</h1>
        <button onClick={() => downloadVcf(generateVcfData(employee))}>
          Download Employee Contact as VCF
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>Employee VCF Download with QR Code</h1>
        <button onClick={generateVcfAndUrl}>View QR Code</button>
      </div>
      {vcfData && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <QRCode value={`BEGIN:VCARD\n${vcfData}\nEND:VCARD`} />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeVcfDownload;
