import React, { useState, useEffect } from 'react';
import { useTags } from './TagsContext';

function DocumentsList() {
    const [documentNames, setDocumentNames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { tags, setTags } = useTags();
    const { docname, setDocName } = useTags();

    useEffect(() => {
        fetch('/documents')
            .then((response) => response.json())
            .then((data) => setDocumentNames(data))
            .catch((error) => {
                console.error('Error fetching document names:', error);
            });
    }, []);

    const filteredDocuments = documentNames.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDocumentClick = (documentName) => {
        setDocName(documentName);
        // Make an API call to perform actions on the server side
        fetch(`/documents/getTags/${documentName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) =>  {
                 response.json().then(tags => {setTags(tags)});
            })
            .catch((error) => {
                console.error('Error performing actions:', error);
            });
    };

    return (
        <div className="documents-list p-3 bg-light">
            <h3>Documents List</h3>
            <input
                type="text"
                placeholder="Search documents"
                className="form-control mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="list-group">
                {filteredDocuments.map((name, index) => (
                    <li key={index} className="list-group-item list-group-item-action cursor-pointer" onClick={() => handleDocumentClick(name)}>
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DocumentsList;
