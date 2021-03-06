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
        phone_number: "",
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
        id: "",
        email: "",
        full_name: "",
        password_hash: "",
        score: 0,
        user_group_join_code: ""
      },
      user_group: {
        join_code: "",
        group_name: "",
        users: [],
        chores: []
      },
      session: null,
      chore_form: {
        completed: false,
        desc: "",
        name: "",
        id: "",
        value: 1,
        assign_interval: 7,
        complete_interval: 7,
        days_passed_for_assign: 0,
        days_passed_for_complete: 0,
        user: null
      }
    };
  }

  update_register_form(data) {
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
      phone_number: this.state.register_form.phone_number,
      full_name: this.state.register_form.full_name,
      password_hash: this.state.register_form.password_hash,
      score: 0,
      user_group_join_code: this.state.user_group.join_code,
    }
    $.ajax("/api/v1/users", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ user: user }),
      success: resp => {
        let state1 = _.assign({}, this.state, {
          user: resp.data,
          session: { user_id: resp.data.id }
        });
        this.setState(state1);
        this.fetch_users();
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
        users: [],
        chores: []
      },
      session: null,
      chore_form: {

      }
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

  get_user_chores(user_id) {
    let chores = this.state.user_group.chores;
    let userChores = _.filter(chores, function(c){ return c.user_id === user_id });
    return userChores;
  }

  fetch_current_user_group() {
    $.ajax("/api/v1/usergroups/" + this.state.user.user_group_join_code, {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: resp => {
        console.log(resp.data);
        let state1 = _.assign({}, this.state, { user_group: resp.data });
        this.setState(state1);
      }
    })
  }

  update_chore_form(data) {
    let form1 = _.assign({}, this.state.chore_form, data);
    let state1 = _.assign({}, this.state, { chore_form: form1 });
    this.setState(state1);
  }

  create_chore() {
    let chore = this.state.chore_form;
    chore.user_group_join_code = this.state.user_group.join_code;
    $.ajax("/api/v1/chores", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ chore: chore }),
      success: resp => {
        console.log(resp.data);
        this.fetch_current_user_group();
      }
    });
  }

  complete_chore(chore) {
    chore.completed = true;
    $.ajax("/api/v1/chores/" + chore.id, {
      method: "put",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ id: chore.id, chore: chore }),
      success: (resp) => {
        console.log(resp.data);
        this.fetch_current_user_group();
      }
    });
  }

  update_chore() {
    let chore = this.state.chore_form;
    $.ajax("/api/v1/chores/" + chore.id, {
      method: "put",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ id: chore.id, chore: chore }),
      success: (resp) => {
        console.log(resp.data);
        this.fetch_current_user_group();
      }
    });
  }

  send_reminder(chore) {
    $.ajax("/api/v1/chores/" + chore.id + "/remind", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ id: chore.id, name: this.state.user.full_name }),
      success: (resp) => {
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
            render={() => <ChorePage root={this} />}
          />
          <Route
            path="/chores/edit/"
            exact={true}
            render={() => <ChoreForm root={this}/>} 
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
      <div className="col-8 mt-2 row">
        <div className="col-4">
          <Link to={"/roommates"}><span className="navHeader">Roommates</span></Link>
        </div>
        <div className="col-4">
          <Link to={"/chores"}><span className="navHeader">House Chores</span></Link>
        </div>
        <div className="col-4">
          {root.state.user.full_name} | 
          <Link to={"/"} onClick={() => root.logout()}> Logout</Link>
        </div>
    </div>);
  } 
  return (
    <div className="row my-2">
      <div className="col-4">
        <h1>
          <Link to={"/"}><img className="logo-image" src="https://i.imgur.com/YHCsjkU.png" /></Link>
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
          <input className= "form-control" type="tel" id="phone" name="phone" placeholder="1234567890"
          onChange={ev =>
            root.update_register_form({ phone_number: "+1" + ev.target.value })
          }
          pattern="[0-9]{10}"
          required></input>
          <p>Format: ##########</p>
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
        <Link to={"/"}><button onClick={() => root.register()} className="btn btn-secondary">
          Register
        </button></Link>
      </div>
    </div>
  );
}

function HomePage(props) {
  let { root } = props;
  return (
    <div className="container">
          <span className="cc-title mb-3"><strong>My chores</strong></span>
          <ChoreList root={root} chores={root.get_user_chores(root.state.user.id)}/>
    </div>
  );
}

function User(props) {
  let root = props.root;
  let user = props.user;
  return (
    <div className="row my-3">
      <div className="col-12">
        <p className="roommate-name my-1"><strong>{user.full_name}</strong></p>
        <hr className="mt-0"/>
      </div>
      <div className="col-12">
        <ChoreList root={root} chores={root.get_user_chores(user.id)}/>
      </div>
    </div>
  );
}

function UserGroup(props) {
  let { root } = props;
  let users = _.map(root.state.user_group.users, u => 
      <User root={root} key={u.id} user={u} />
  );
  return (
    <div>
      <span className="cc-title my-3"><strong>{root.state.user_group.name}</strong></span>
      <span className="join-code mx-3 my-3 px-2 py-2">Join code: {root.state.user_group.join_code}</span>
      <div className="container">
        {users}
      </div>
    </div>
  );
}

function Chore(props) {
  let { root } = props;
  let chore = props.chore;
  let actionGroup;
  let badge;
  if (chore.user_id === root.state.user.id) {
    if (chore.completed) {
      actionGroup = 
        <span>
        </span>;
      badge = <span className="tag badge badge-success py-2 px-2 mx-3">COMPLETED</span>
    } else {
      actionGroup = 
        <span>
          <button className="btn btn-primary" onClick={() => root.complete_chore(chore)}>Mark as completed</button>
        </span>;
      badge = 
        <span>
        </span>;
    }
  } else {
    actionGroup = 
      <span>
        <button className="btn btn-warning" onClick={() => root.send_reminder(chore)}>Send Reminder</button>
        <Link to={"/chores/edit"} onClick={() => root.update_chore_form(chore)}> <button className="btn btn-light">Edit</button></Link>
      </span>
  }
  return (
    <div className="row">
    <div className="card mb-3">
    <h4 className="card-header"><strong>{chore.name}</strong> {badge}</h4>
      <div className="card-body">
        <p className="card-text">
          {chore.desc} <br />
          Re-assigned every {chore.assign_interval} days
          <br />
          Completed every {chore.complete_interval} days<br/>
        </p>
        {actionGroup}
      </div>
    </div>
    </div>
  );
}

function ChoreList(props) {
  let root = props.root;
  let houseChores = props.chores;
  let chores;
  if (houseChores.length == 0) {
    chores = <p className="placeholder">No chores yet!</p>;
  }
  else {
    chores = _.map(houseChores, c => <Chore key={c.id} chore={c} root={root} />);
  }
  return (
    <div className="container">
      {chores}
    </div>
  );
}

function ChorePage(props) {
  let { root } = props;
  let chore = {
    completed: false,
    desc: "",
    name: "",
    value: "",
    assign_interval: "",
    complete_interval: "",
    user: null
  }
  return (
    <div className="container">
      <Link to={"/chores/edit"} onClick={() => root.update_chore_form(chore)}> <button className="btn btn-primary mb-3">Add Chore</button></Link>
      <ChoreList root={root} chores={root.state.user_group.chores} />
    </div>
  );
}

function ChoreForm(props) {
  let { root } = props;
  let chore = root.state.chore_form;
  let choreTitle, choreButton;
  if (chore.id) {
    choreTitle = "Edit Chore";
    choreButton = <Link to={"/chores"}><button onClick={() => root.update_chore()} className="btn btn-primary">Save</button></Link>
  } else {
    choreTitle = "New Chore";
    choreButton = <Link to={"/chores"}><button onClick={() => root.create_chore()} className="btn btn-primary">Save</button></Link>
  }
  return (
    <div className="container">
      <h1>{choreTitle}</h1>
      <div className="row">
        <form className="col-12">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Ex. Taking out the trash"
              value={chore.name}
              onChange={ev =>
                root.update_chore_form({ name: ev.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Ex. Empty all the trash and bring it to the dumpster outside"
              value={chore.desc}
              onChange={ev =>
                root.update_chore_form({ desc: ev.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
          <label>Points</label>
            <input
              type="number"
              value={chore.value}
              onChange={ev =>
                root.update_chore_form({ value: ev.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Number of days before it's reassigned</label>
            <input
              type="number"
              value={chore.assign_interval}
              onChange={ev =>
                root.update_chore_form({ assign_interval: ev.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Number of days before it needs to be done again</label>
            <input
              type="number"
              value={chore.complete_interval}
              onChange={ev =>
                root.update_chore_form({ complete_interval: ev.target.value })
              }
              className="form-control"
            />
          </div>
        </form>
        <Link to={"/chores"}><button className="btn btn-secondary">Cancel</button></Link>
        {choreButton}
      </div>
    </div>
  );
}

