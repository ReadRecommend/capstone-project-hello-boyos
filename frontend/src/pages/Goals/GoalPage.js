import React, { Component } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import {
    LineChart,
    Line,
    Legend,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Datetime from "react-datetime";
import "../YearPicker.css";
import { getGoals } from "../../fetchFunctions";
import { toast, ToastContainer } from "react-toastify";
import * as moment from "moment";

import AddGoalModal from "../../components/Goals/AddGoalModal";

class GoalPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            months: [
                { month: "Jan" },
                { month: "Feb" },
                { month: "Mar" },
                { month: "Apr" },
                { month: "May" },
                { month: "Jun" },
                { month: "Jul" },
                { month: "Aug" },
                { month: "Sep" },
                { month: "Oct" },
                { month: "Nov" },
                { month: "Dec" },
            ],
            data: [],
            yearView: null,
            yearPickerValue: null,
            modalShow: false,
            loading: false,
        };
    }

    // Function that makes the modal show
    openModal = () => {
        this.setState({ modalShow: true });
    };

    // Function that makes the modal close
    closeModal = () => {
        this.setState({ modalShow: false });
    };

    // Function that handles the changing of the yearpicker value programmatically and closes modal
    updateGraph = (year) => {
        // Change value of datetime/yearpicker
        this.setState({ yearPickerValue: moment([year]) });
        this.closeModal();
        // Trigger the on change
        this.onYearViewChange(moment([year]));
    };

    // Function that updates the data in the state given data from a fetch
    updateData = (data) => {
        if (data.length === 0) {
            this.setState({ loading: false });
            return;
        }

        // Make a copy of the months array
        let monthsBase = JSON.parse(JSON.stringify(this.state.months));
        for (const dataPoint of data) {
            // Update the data displayed in the graph
            let monthDataPoint = monthsBase[dataPoint.month - 1];
            monthDataPoint.n_read = dataPoint.n_read;
            monthDataPoint.goal = dataPoint.goal;
        }

        this.setState({ data: monthsBase, loading: false });
    };

    // Function that handles a change in the year picker
    onYearViewChange = (date) => {
        const year = date.toDate().getFullYear();
        this.setState({
            yearView: year,
            yearPickerValue: moment([year]),
            data: [],
            loading: true,
        });

        getGoals(year)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                // Update the data in our graph
                this.updateData(json);
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
                    this.setState({ loading: false });
                }
            });
    };

    render() {
        return (
            <Container>
                <ToastContainer autoClose={4000} pauseOnHover closeOnClick />

                <h1>Goal Page</h1>
                <h3>Select a year to view your goal progress for that year</h3>
                {this.state.loading ? (
                    // If we are loading, show a spinner
                    <Spinner
                        animation="border"
                        style={{
                            left: "50%",
                            top: "50%",
                        }}
                    />
                ) : (
                    // If we are not loading, show this content
                    <div
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Datetime
                                dateFormat="YYYY"
                                input={false}
                                value={this.state.yearPickerValue}
                                onChange={this.onYearViewChange}
                            />
                        </div>
                        <h3>{this.state.yearView || "No Year Selected"}</h3>
                    </div>
                )}

                {this.state.data.length === 0 &&
                    !this.state.loading &&
                    this.state.yearView && (
                        <p>No Goals found for this year...</p>
                    )}

                {
                    // Ensure we have a year selected, we are not loading, and data was returned before displaying the diagram
                    this.state.yearView &&
                        this.state.data.length !== 0 &&
                        !this.state.loading && (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart
                                    width={1200}
                                    height={400}
                                    data={this.state.data}
                                    margin={{
                                        top: 5,
                                        right: 20,
                                        bottom: 5,
                                        left: 0,
                                    }}
                                >
                                    <Line
                                        type="linear"
                                        dataKey="n_read"
                                        stroke="#8884d8"
                                    />
                                    <Line
                                        type="linear"
                                        dataKey="goal"
                                        stroke="green"
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <CartesianGrid
                                        stroke="#ccc"
                                        strokeDasharray="5 5"
                                    />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                </LineChart>
                            </ResponsiveContainer>
                        )
                }
                <br></br>
                <AddGoalModal
                    show={this.state.modalShow}
                    closeModal={this.closeModal}
                    updateGraph={this.updateGraph}
                />
                <div style={{ textAlign: "center" }}>
                    <Button onClick={this.openModal}>
                        Create or Update a Goal
                    </Button>
                </div>
            </Container>
        );
    }
}

export default GoalPage;
