import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import $ from "jquery";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";

export default function root_init(node) {
  let chores = window.chores;
  let users = window.users;
  ReactDOM.render(<Root chores={chores} users={users} />, node);
}

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      register_form: { email: "", password_hash: "", admin: false }
    };
  }

  render() {
    return (
      <Router>
        <div>
          <Header root={this} />
          <Route
            path="/"
            exact={true}
            render={() => <RegisterForm root={this} />}
          />
        </div>
      </Router>
    );
  }
}

function Header(props) {
  let { root } = props;
  return (
    <div className="row my-2">
      <div className="col-2">
        <p />
      </div>
    </div>
  );
}

function RegisterForm(props) {
  let { root } = props;
  return (
    <div>
      <h1>Register an Account</h1>
      <div className="row">
        <input
          type="email"
          placeholder="email"
          onChange={ev => root.update_register_form({ email: ev.target.value })}
        />
        <input
          type="password"
          placeholder="password"
          onChange={ev =>
            root.update_register_form({ password_hash: ev.target.value })
          }
        />
        <button onClick={() => root.register()} className="btn btn-secondary">
          Register
        </button>
      </div>
    </div>
  );
}
