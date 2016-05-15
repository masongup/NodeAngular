const React = require('react');
const securityService = require('./SecurityService.jsx');
const BookInfoBase = require('./BookInfoBase.jsx');
const { Link } = require('react-router');

module.exports = class BookDetails extends BookInfoBase {
  render() {
    if (this.state) {
      return <div>
          <div><Link to={'books'}>Back to List</Link></div>
          <ul>
            <li>Book Title: {this.state.title}</li>
            <li>Book Author: {this.state.authors.name}</li>
            <li>Book Summary: {this.state.description}</li>
          </ul>
          { securityService.canEdit() ? <Link to={`/book/${this.state.id}/edit`}>Edit Book</Link> : '' }
       </div>; 
    }
    else {
      return null;
    }
  }
}

