import React, { Component } from "react";
import { Button, Container, Spinner, Row, Col } from "react-bootstrap";
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
import "../Styles/YearPicker.css";
import { getGoals } from "../../fetchFunctions";
import { toast } from "react-toastify";
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
            loadingGraph: true,
            loadingPage: true,
        };
    }

    componentDidMount() {
        this.setState(
            { loadingPage: false },
            this.onYearViewChange(moment().startOf("year"))
        );
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
            this.setState({ loadingGraph: false });
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

        this.setState({ data: monthsBase, loadingGraph: false });
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

    renderGraph = () => {
        if (this.state.loadingGraph) {
            return (
                <Spinner
                    animation="border"
                    style={{
                        left: "50%",
                        top: "50%",
                    }}
                />
            );
        } else if (this.state.data.length === 0 && !this.state.loadingGraph) {
            return <p>No Goals found for this year...</p>;
        } else {
            return (
                <>
                    <h3>{this.state.yearView || "No Year Selected"}</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            title={this.state.yearView}
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
                                type="monotone"
                                dataKey="n_read"
                                stroke="#8884d8"
                                name="Books Read"
                            />
                            <Line
                                type="monotone"
                                dataKey="goal"
                                stroke="green"
                                name="Goal"
                            />
                            <Legend verticalAlign="bottom" height={36} />
                            <CartesianGrid
                                stroke="#ccc"
                                strokeDasharray="5 5"
                            />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            );
        }
    };

    render() {
        if (this.state.loadingPage) {
            return (
                <Spinner
                    animation="border"
                    style={{
                        left: "50%",
                        top: "50%",
                    }}
                />
            );
        }
        return (
            <Container fluid>
                <h1>Reading Goals</h1>
                <Row>
                    <Col md="2">
                        <h5>Select a year to view your progress</h5>
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
                        <br></br>
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
                        </div>
                    </Col>
                    <Col md="8">{this.renderGraph()}</Col>
                </Row>
            </Container>
        );
    }
}

export default GoalPage;
