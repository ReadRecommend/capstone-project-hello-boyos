import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Datetime from 'react-datetime';
import '../YearPicker.css';
import { getGoals } from '../../fetchFunctions';
import { toast, ToastContainer } from 'react-toastify';

import AddGoalModal from '../../components/Goals/AddGoalModal';


class GoalPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                { month: "Jan", goal: 0, n_read: 0 },
                { month: "Feb", goal: 0, n_read: 0 },
                { month: "Mar", goal: 0, n_read: 0 },
                { month: "Apr", goal: 0, n_read: 0 },
                { month: "May", goal: 0, n_read: 0 },
                { month: "Jun", goal: 0, n_read: 0 },
                { month: "Jul", goal: 0, n_read: 0 },
                { month: "Aug", goal: 0, n_read: 0 },
                { month: "Sep", goal: 0, n_read: 0 },
                { month: "Oct", goal: 0, n_read: 0 },
                { month: "Nov", goal: 0, n_read: 0 },
                { month: "Dec", goal: 0, n_read: 0 }],
            yearView: null,
            modalShow: false
        }
    }

    // Function that makes the modal show
    openModal = () => {
        this.setState({ modalShow: true, });
    }

    // Function that makes the modal close
    closeModal = () => {
        this.setState({ modalShow: false, });
    }

    // Function that updates the data in the state given data from a fetch
    updateData = (data) => {

        let stateDataCopy = this.state.data;
        for (const dataPoint of data) {
            let monthDataPoint = stateDataCopy[dataPoint.month - 1];
            monthDataPoint.n_read = dataPoint.n_read;
            monthDataPoint.goal = dataPoint.goal;
        }

        console.log(stateDataCopy);
        this.setState({ data: stateDataCopy }, console.log(this.state.data));

    }

    // Function that handles a change in the year picker
    onYearViewChange = (date) => {
        const year = date.toDate().getFullYear();
        this.setState({
            yearView: year,
        });

        getGoals(year)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json()
            })
            .then((json) => {
                console.log(json);
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
                }
            })

    }

    render() {
        return (
            <Container>
                <ToastContainer autoClose={4000} pauseOnHover closeOnClick />

                <h1>Goal Page</h1>
                <h3>Select a year to view your goal progress for that year:</h3>
                <Datetime
                    dateFormat="YYYY"
                    input={false}
                    onChange={this.onYearViewChange}
                />

                <h3>{this.state.yearView || "No Year Selected"}</h3>
                { // Ensure we have a year selected before displaying the diagram
                    this.state.yearView &&
                    < ResponsiveContainer width="100%" height={400}>
                        <LineChart width={1200} height={400} data={this.state.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <Line type="linear" dataKey="n_read" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                }

                <h1>Create/Update Goal</h1>
                <AddGoalModal show={this.state.modalShow} closeModal={this.closeModal} />
                <Button onClick={this.openModal}>Create/Update Goal</Button>
            </Container >
        );
    }
}

export default GoalPage;