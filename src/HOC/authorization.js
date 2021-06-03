import db from "../helpers/localDB";
import React  from "react";

// Authorization HOC
const Authorization = allowedRoles => WrappedComponent =>
  class WithAuthorization extends React.Component {
    
    render() {
      const role  = db.get("role").value();
      if (allowedRoles.includes(role)) {
        return <WrappedComponent {...this.props} />;
      } else {
        return <h4 className="alert alert-danger text-center text-danger p-4">متاسفیم اجازه دسترسی به چنین صفحه ای ندارید :(</h4>;
      }
    }
  };

export default Authorization;
