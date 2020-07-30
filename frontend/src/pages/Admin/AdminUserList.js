import React, { Component } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getAllUsers, deleteUser } from "../../fetchFunctions";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const { SearchBar, ClearSearchButton } = Search;

class AdminUserList extends Component {
    constructor(props) {
        super(props);

        this.getDeleteFormatter = this.getDeleteFormatter.bind(this);
        this.state = {
            loading: true,
            users: [],
        };
    }

    componentDidMount() {
        // Get all the books in the db
        getAllUsers()
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                this.setState({ users: json, loading: false });
            })
            .catch((error) => {
                // An error occurred
                let errorMessage = "Something went wrong...";
                try {
                    errorMessage = JSON.parse(error.message).message;
                } catch {
                    errorMessage = error.message;
                } finally {
                    toast.error(errorMessage);
                }
            });
    }

    // Function that returns href for the user
    getUsernameFormatter(cell, row) {
        if (!row.roles.includes("admin")) {
            // Admins shouldn't have pages
            return <Link to={"/user/" + row.id}>{cell}</Link>;
        } else {
            return <p>{cell}</p>;
        }
    }

    // Function that returns the delete button that will be displayed in the final dummy column of the table
    getDeleteFormatter(cell, row) {
        if (!row.roles.includes("admin")) {
            // We shouldn't be able to delete admins
            return (
                <Button
                    variant="danger"
                    onClick={this.handleDeleteUser.bind(this, row.id)}
                >
                    DELETE
                </Button>
            );
        }
    }

    getColumns() {
        // Define the columns for our table
        const columns = [
            {
                dataField: "id",
                text: "ID",
                style: { wordWrap: "break-word" },
                sort: true,
            },
            {
                dataField: "username",
                text: "Username",
                formatter: this.getUsernameFormatter,
                sort: true,
                style: { wordWrap: "break-word" },
            },
            {
                dataField: "email",
                text: "Email",
                sort: true,
                style: { wordWrap: "break-word" },
            },
            {
                dataField: "roles",
                text: "Role",
                sort: true,
                style: { wordWrap: "break-word" },
            },
            {
                dataField: "delete",
                text: "",
                isDummyField: true,
                formatter: this.getDeleteFormatter,
                style: { textAlign: "center" },
            },
        ];

        return columns;
    }

    handleDeleteUser(id) {
        this.setState({ loading: true });

        deleteUser(id)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                toast.success(`Successfully deleted user with id '${id}'`);
                this.setState({ users: json, loading: false });
            })
            .catch((error) => {
                // An error occurred
                let errorMessage = "Something went wrong...";
                try {
                    errorMessage = JSON.parse(error.message).message;
                } catch {
                    errorMessage = error.message;
                } finally {
                    toast.error(errorMessage);
                }
            });
    }

    render() {
        if (this.state.loading) {
            // Still performing the fetch
            return (
                <Spinner
                    animation="border"
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                    }}
                />
            );
        } else {
            return (
                <Container>
                    <h1>User list</h1>
                    <br></br>
                    {/* This is for react bootstrap table 2 */}
                    <ToolkitProvider
                        data={this.state.users}
                        keyField="id"
                        columns={this.getColumns()}
                        bootstrap4
                        search
                    >
                        {(props) => (
                            <div>
                                <h3>Search in any of the columns</h3>
                                <SearchBar {...props.searchProps} />
                                <ClearSearchButton {...props.searchProps} />
                                <BootstrapTable
                                    {...props.baseProps}
                                    pagination={paginationFactory({
                                        alwaysShowAllBtns: true,
                                    })}
                                />
                            </div>
                        )}
                    </ToolkitProvider>
                </Container>
            );
        }
    }
}

export default AdminUserList;
