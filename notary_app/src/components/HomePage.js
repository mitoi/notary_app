import React from 'react';
import DocumentsList from './DocumentsList';
import DocumentFill from './DocumentFill';

function HomePage() {
  return (
    <div className="container mt-5">
      <div className="row">
      <div className="col-md-4">
          <DocumentsList />
        </div>
        <div className="col-md-8">
          <DocumentFill />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
