import React, { useEffect } from 'react';
import QRCode from 'qrcode';

function QRCodeGenerator({ text }) {
  useEffect(() => {
    const canvas = document.getElementById('qrcode-canvas');
    QRCode.toCanvas(canvas, text, function (error) {
      if (error) {
        console.error(error);
      }
      console.log('QR code generated!');
    });
  }, [text]);

  function handleDownload() {
    const canvas = document.getElementById('qrcode-canvas');
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = dataURL;
    link.click();
  }

  return (
    <>
      <canvas id='qrcode-canvas' />
      <a href={text} target='_blank' rel='noreferrer'>
        {text}
      </a>
      <input
        type='submit'
        onClick={handleDownload}
        value='Download'
        style={{
          marginTop: '1rem',
          width: '15rem',
        }}
      />
    </>
  );
}

export default QRCodeGenerator;
