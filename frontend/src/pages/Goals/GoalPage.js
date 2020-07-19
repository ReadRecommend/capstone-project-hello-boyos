import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Datetime from 'react-datetime';
import '../YearPicker.css';

class GoalPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [{ month: 'Jan', read: 3 }, { month: 'Feb', read: 50 }, { month: 'March', read: 6 }, { month: 'April', read: 23 }],
            yearView: null,
            timePeriod: null
        }
    }

    // Function that handles the 
    onDateViewChange = (date) => {
        if (this.validDate(date)) {
            this.setState({
                yearView: date.toDate().getFullYear(),
            });
        } else {
            console.log("invalid");
        }
    }

    onDateAddChange = (date) => {
        if (this.validDate(date)) {
            this.setState({
                timePeriod: [date.toDate().getMonth(), date.toDate().getFullYear()],
            });
            console.log(this.state.timePeriod);
        } else {
            console.log("invalid");
        }
    }

    // Function that determines if a date given is valid datetime format
    validDate = (date) => {
        try {
            date.toDate();
            return true;
        } catch {
            return false;
        }
    }

    render() {
        return (
            <Container>
                <h1>Goal Page</h1>
                <h3>Select a year:</h3>
                <Datetime
                    dateFormat="YYYY"
                    input={false}
                    onChange={this.onDateViewChange}
                />

                <h3>{this.state.yearView}</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart width={1200} height={400} data={this.state.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="linear" dataKey="read" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>

                <h1>Add new goal</h1>
                <Datetime
                    dateFormat="MMM YYYY"
                    input={false}
                    isValidDate={(current) => {
                        return current.isAfter(Datetime.moment());
                    }}
                    onChange={this.onDateAddChange}
                />
            </Container >
        );
    }
}

GoalPage.propTypes = {
    initialUserInfo: PropTypes.object.isRequired
}

export default GoalPage;