import React, { Component } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import Datetime from "react-datetime";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";

import "../../pages/Styles/YearPicker.css";
import { updateGoal } from "../../fetchFunctions";

class AddGoalModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timePeriod: null,
            dateInput: null,
            goal: 1,
        };
    }

    // Function that handles a selection of month/year in Datetime component
    onDateChange = (date) => {
        this.setState({
            timePeriod: {
                month: date.toDate().getMonth() + 1,
                year: date.toDate().getFullYear(),
            },
            dateInput: date,
        });
    };

    // Function that handles a change in the input values for desiredGoal/nRead
    onGenericChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    // Function that handles cleanup on closing of the modal
    onClose = () => {
        this.setState({ timePeriod: null, goal: 1 }, this.props.closeModal);
    };

    // Function that closes the modal and changes the year selection on the goal page
    closeAndSelect = (year) => {
        this.setState(
            { timePeriod: null, goal: 1 },
            this.props.updateGraph.bind(this, year)
        );
    };

    // Function that handles the submit goal button
    onGoalSubmit = (e) => {
        e.preventDefault();

        if (this.state.timePeriod === null) {
            toast.error("Please fill in all required fields");
            return;
        }

        updateGoal(
            this.state.timePeriod.month,
            this.state.timePeriod.year,
            this.state.goal
        )
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                toast.success("Successfully updated goal");
                this.closeAndSelect(this.state.timePeriod.year);
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
    };

    render() {
        return (
            <Modal show={this.props.show} onHide={this.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create or Update Goal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.onGoalSubmit}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        >
                            <Datetime
                                dateFormat="MMM YYYY"
                                input={false}
                                onChange={this.onDateChange}
                            />
                        </div>

                        <Form.Group>
                            <Form.Label>Goal Books</Form.Label>
                            <Form.Control
                                type="number"
                                name="goal"
                                value={this.state.goal}
                                onChange={this.onGenericChange}
                            />
                        </Form.Group>

                        <Button variant="outline-primary" type="submit">
                            Create/Update Goal
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

AddGoalModal.propTypes = {
    show: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    updateGraph: PropTypes.func.isRequired,
};

export default withRouter(AddGoalModal);
