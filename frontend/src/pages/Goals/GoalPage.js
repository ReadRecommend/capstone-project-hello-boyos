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
                { month: "Dec", }],
            data: [],
            yearView: null,
            modalShow: false,
            loading: false
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

        if (data.length === 0) {
            return;
        }

        // Make a copy of the months array
        let monthsBase = JSON.parse(JSON.stringify(this.state.months));
        for (const dataPoint of data) {
            let monthDataPoint = monthsBase[dataPoint.month - 1];
            monthDataPoint.n_read = dataPoint.n_read;
            monthDataPoint.goal = dataPoint.goal;
        }

        console.log(monthsBase);
        console.log(this.state.data);
        this.setState({ data: monthsBase }, console.log(this.state.data));

    }

    // Function that handles a change in the year picker
    onYearViewChange = (date) => {
        const year = date.toDate().getFullYear();
        this.setState({
            yearView: year,
            data: []
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
                <h3>Select a year to view your goal progress for that year</h3>
                <h3>{this.state.yearView || "No Year Selected"}</h3>
                { // If we are loading, Don't show any of this

                }
                <Datetime
                    dateFormat="YYYY"
                    input={false}
                    onChange={this.onYearViewChange}
                />

                {this.state.data.length === 0 &&
                    <p>No Goals found for this year...</p>
                }
                { // Ensure we have a year selected, and data was returned before displaying the diagram
                    this.state.yearView && this.state.data.length !== 0 &&
                    < ResponsiveContainer width="100%" height={400}>
                        <LineChart width={1200} height={400} data={this.state.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <Line type="linear" dataKey="n_read" stroke="#8884d8" />
                            <Line type="linear" dataKey="goal" stroke="green" />
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