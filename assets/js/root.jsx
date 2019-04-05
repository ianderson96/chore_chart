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
      login_form: {
        email: "",
        password_hash: ""
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
        group_name: "",
        users: []
      },
      session: null
    };
  }

  update_register_form(data) {
    // console.log(data);
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
        // console.log(resp.data);
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
        // console.log(resp.data);
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
        // console.log(resp.data);
        let state1 = _.assign({}, this.state, {
          user: resp.data,
          session: { user_id: resp.data.id }
        });
        this.setState(state1);
        this.fetch_users();
        // console.log(this.state);
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
        // console.log(resp.data);
      }
    });
  }

  update_login_form(data) {
    let form1 = _.assign({}, this.state.login_form, data);
    let state1 = _.assign({}, this.state, { login_form: form1 });
    this.setState(state1);
  }

  login() {
    $.ajax("/api/v1/auth", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(this.state.login_form),
      success: resp => {
        // console.log(resp.data);
        let state1 = _.assign({}, this.state, { session: resp.data });
        this.setState(state1, () => this.fetch_current_user());
      }
    });
  }

  logout() {
    return this.setState({
      register_form: {
        email: "",
        full_name: "",
        password_hash: "",
        score: 0,
        group_action: "join",
        join_code: "",
        group_name: ""
      },
      login_form: {
        email: "",
        password_hash: ""
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
        group_name: "",
        users: []
      },
      session: null
    })
  }

  fetch_current_user() {
    $.ajax("/api/v1/users/" + this.state.session.user_id, {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: resp => {
        let state1 = _.assign({}, this.state, { user: resp.data });
        this.setState(state1, () => this.fetch_current_user_group());
      }
    });
  }

  // fetch_user_name() {
  //   $.ajax("/api/v1/users/" + this.state.session.user_id, {
  //     method: "get",
  //     dataType: "json",
  //     contentType: "application/json; charset=UTF-8",
  //     data: "",
  //     success: resp => {
  //       let state1 = _.assign({}, this.state, { user: resp.data });
  //       this.setState(state1, () => this.fetch_current_user_group());
  //     }
  //   });
  // }

  fetch_current_user_group() {
    $.ajax("/api/v1/usergroups/" + this.state.user.user_group_join_code, {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: resp => {
        let state1 = _.assign({}, this.state, { user_group: resp.data });
        this.setState(state1);
      }
    })
  }

  render() {
    return (
      <Router>
        <div>
          <Header root={this} />
          <Route
            path="/"
            exact={true}
            render={() => <LandingPage root={this} />}
          />
          <Route
            path="/register"
            exact={true}
            render={() => <RegisterForm root={this} />}
          />
          <Route
            path="/roommates"
            exact={true}
            render={() => <UserGroup root={this} />}
          />
          <Route
            path="/chores"
            exact={true}
            render={() => <ChoreList root={this} />}
          />
        </div>
      </Router>
    );
  }
}

function Header(props) {
  let { root } = props;
  let rightHeader = null;
  if (root.state.session) {
    rightHeader = (
      <div className="col-8 row">
        <div className="col-4">
          <Link to={"/roommates"}>Roommates</Link>
        </div>
        <div className="col-4">
          <Link to={"/chores"}>House Chores</Link>
        </div>
        <div className="col-4">
          {root.state.user.full_name} | 
          <a onClick={() => root.logout()}> Logout</a>
        </div>
    </div>);
  } 
  return (
    <div className="row my-2">
      <div className="col-4">
        <h1>
          <Link to={"/"}>ChoreChart</Link>
        </h1>
      </div>
      {rightHeader}
    </div>
  );
}

function LandingPage(props) {
  let { root } = props;
  let content = root.state.session ? <HomePage root = {root} /> : <LoginForm root = {root} />;
  return <div className="container">{content}</div>;
}

function LoginForm(props) {
  let { root } = props;
  return <div className="form-group my-2">
        <h1>Log in</h1>
        <input
          type="email"
          placeholder="email"
          onChange={ev => root.update_login_form({ email: ev.target.value })}
          className="form-control"
        />
        <input
          type="password"
          placeholder="password"
          onChange={ev => root.update_login_form({ password: ev.target.value })}
          className="form-control"
        />
        <button onClick={() => root.login()} className="btn btn-primary">
          Login
        </button>
        <p>
          <Link to={"/register"}> or Register an Account</Link>
        </p>
      </div>;
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

function HomePage(props) {
  let { root } = props;
  return <p>{"Welcome back, " + root.state.user.full_name}</p>;
}

function User(props) {
  let { user } = props;
  return (
    <div className="row">
      <div className="col-8">
        <h3>{user.full_name}</h3>
      </div>
      <div className="col-4">
        {user.score} points
      </div>
    </div>
  );
}

function UserGroup(props) {
  let { root } = props;
  console.log(root.state);
  let users = _.map(root.state.user_group.users, u => 
    <div className="row">
      <User key={u.id} user={u} />
    </div>
  );
  return (
    <div className="container">
      <h2>{root.state.user_group.name}</h2>
      {users}
    </div>
  );
}

function Chore(props) {
  let { chore } = props;
  return (
    <div className="card col-10">
      <div className="card-body">
        <h2 className="card-title">{chore.name}</h2>
        <p className="card-text">
          {chore.desc} <br />
          {chore.value} points
          <br />
          Re-assigned every {chore.assign_interval} days
          <br />
          Completed every {chore.complete_interval} days<br/>
          Currently assigned to: {chore.user_id}
        </p>
      </div>
    </div>
  );
}

function ChoreList(props) {
  let { root } = props;
  // console.log(root.state.chores);
  let chores = _.map(root.state.chores, c => <Chore key={c.id} chore={c} />);
  console.log(chores);
  return (
    <div className="container">
      <div className="row">{chores}</div>
    </div>
  );
}
