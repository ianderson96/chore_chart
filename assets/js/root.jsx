import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import $ from "jquery";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import shortid from "shortid";

export default function root_init(node) {
  let chores = window.chores;
  let users = window.users;
  ReactDOM.render(<Root chores={chores} users={users} />, node);
}

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chores: props.chores,
      users: props.users,
      register_form: {
        email: "",
        full_name: "",
        password_hash: "",
        score: 0,
        group_action: "join",
        join_code: "",
        group_name: ""
      },
      user: {
        email: "",
        full_name: "",
        password_hash: "",
        score: 0,
        user_group_join_code: ""
      },
      user_group: {
        join_code: "",
        group_name: ""
      },
      session: null,
      users: this.fetch_users()
    };
  }

  update_register_form(data) {
    console.log(data);
    let form1 = _.assign({}, this.state.register_form, data);
    let state1 = _.assign({}, this.state, { register_form: form1 });
    this.setState(state1);
  }

  register() {
    if (this.state.register_form.group_action === "join") {
      this.join_user_group();
    } else {
      this.create_user_group();
    }
  }

  create_user_group() {
    let user_group = { 
      join_code: shortid.generate(),
      name: this.state.register_form.group_name
    };
    $.ajax("/api/v1/usergroups", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ user_group: user_group}),
      success: resp => {
        console.log(resp.data);
        let state1 = _.assign({}, this.state, {
          user_group: resp.data
        });
        this.setState(state1, () => this.register_user());
      }
    });
  }

  join_user_group() {
    $.ajax("/api/v1/usergroups/" + this.state.register_form.join_code, {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: resp => {
        console.log(resp.data);
        let state1 = _.assign({}, this.state, {
          user_group: resp.data
        });
        this.setState(state1, () => this.register_user());
      }
    })
  }

  register_user() {
    let user = {
      email: this.state.register_form.email,
      full_name: this.state.register_form.full_name,
      password_hash: this.state.register_form.password_hash,
      score: 0,
      user_group_join_code: this.state.user_group.join_code
    }
    $.ajax("/api/v1/users", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ user: user }),
      success: resp => {
        console.log(resp.data);
        let state1 = _.assign({}, this.state, {
          user: resp.data,
          session: { user_id: resp.data.id }
        });
        this.setState(state1);
        this.fetch_users();
        console.log(this.state);
      }
    });
  }

  fetch_users() {
    $.ajax("/api/v1/users", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: resp => {
        let state1 = _.assign({}, this.state, { users: resp.data });
        this.setState(state1);
        console.log(resp.data);
      }
    });
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
        <h1>ChoreChart</h1>
      </div>
    </div>
  );
}

function RegisterForm(props) {
  let { root } = props;
  let groupInput;
  if (root.state.register_form.group_action == "join") {
    groupInput = (
      <input
        type="text"
        placeholder="Group Join Code"
        onChange={ev =>
          root.update_register_form({ join_code: ev.target.value })
        }
        className="form-control"
      />
    );
  } else if (root.state.register_form.group_action == "create") {
    groupInput = (
      <input
        type="groupName"
        placeholder="Name of New Group"
        onChange={ev =>
          root.update_register_form({ group_name: ev.target.value })
        }
        className="form-control"
      />
    );
  }

  return (
    <div className="container">
      <h1>Register an Account</h1>
      <div className="row">
        <form className="col-12">
          <div className="form-group">
            <input
              type="email"
              placeholder="email"
              onChange={ev =>
                root.update_register_form({ email: ev.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="full name"
              onChange={ev =>
                root.update_register_form({ full_name: ev.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="password"
              onChange={ev =>
                root.update_register_form({ password_hash: ev.target.value })
              }
              className="form-control"
            />
          </div>
          <fieldset className="form-group">
            <div className="row">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  defaultChecked
                  name="group-radio"
                  id="joinExistingGroup"
                  value="join"
                  onChange={ev =>
                    root.update_register_form({ group_action: ev.target.value })
                  }
                />
                <label className="form-check-label" htmlFor="joinExistingGroup">
                  Join an Existing Group
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="group-radio"
                  id="createNewGroup"
                  value="create"
                  onChange={ev =>
                    root.update_register_form({ group_action: ev.target.value })
                  }
                />
                <label className="form-check-label" htmlFor="createNewGroup">
                  Create a New Group
                </label>
              </div>
            </div>
          </fieldset>
          <div className="form-group">{groupInput}</div>
        </form>
        <button onClick={() => root.register()} className="btn btn-secondary">
          Register
        </button>
      </div>
    </div>
  );
}
