import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const DisplayPDF = ({ fileId }) => {
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await axios.get(`/files/${fileId}`, {
          responseType: 'blob',
          withCredentials: true,
        });

        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: 'application/pdf' });

        // Create a data URL from the Blob
        const dataUrl = URL.createObjectURL(blob);

        // Set the data URL in the state
        setPdfUrl(dataUrl);
      } catch (error) {
        console.error('Error fetching PDF:', error.message);
      }
    };

    fetchPDF();
  }, [fileId]);

  return (
    <div>
      <p>
        <strong>PDF Link:</strong>{' '}
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Assignment
        </a>
      </p>
    </div>
  );
};

export default DisplayPDF;
