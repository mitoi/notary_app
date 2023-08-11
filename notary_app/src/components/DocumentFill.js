import React, { useState } from 'react';
import { useTags } from './TagsContext';

function DocumentFill() {
    const { tags } = useTags();
    const { docName } = useTags();

    // eslint-disable-next-line no-undef
    const [formValues, setFormValues] = useState({});

    // Handle input changes
    const handleInputChange = (event, tag) => {
        const { value } = event.target;
        setFormValues((prevValues) => ({ ...prevValues, [tag]: value }));
    };


    const handleGenerate = (e) => {
        e.preventDefault();
        e.preventDefault();
        
        // Create JSON payload from input values
        const payload = {};
        Object.keys(tags).forEach((tag) => {
          if (formValues[tag]) {
            payload[tag] = formValues[tag];
          }
        });
      
        // Make the API call to generate the document
        fetch(`/documents/generate/${docName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then((response) => response.blob()) // Convert response to blob
          .then((blob) => {
            // Create a Blob URL and initiate download
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'generated-document.docx'; // Set desired filename
            link.click();
      
            // Clean up the Blob URL after the download
            URL.revokeObjectURL(blobUrl);
          })
          .catch((error) => {
            console.error('Error generating document:', error);
          });
      };

    // Create the form using the tags
    const renderForm = () => {
        return (
            <form>
                {Object.keys(tags).map((tag, index) => (
                    <div key={index} className="mb-3">
                        <label htmlFor={`tag-${index}`} className="form-label">
                            {tag}
                        </label>
                        <input type="text" id={`tag-${index}`} className="form-control" value={formValues[tag] || ''}
                            onChange={(e) => handleInputChange(e, tag)} />
                    </div>
                ))}
                {Object.keys(tags).length > 0 && ( // Check if there are tags
                    <button type="submit" className="btn btn-primary" onClick={handleGenerate}>
                        Generate
                    </button>
                )}
            </form>
        );
    };

    return (
        <div className="document-fill p-3 bg-light">
            <h3>{docName}</h3>
            {renderForm()}
        </div>
    );
}

export default DocumentFill;
