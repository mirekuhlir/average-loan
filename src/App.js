import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const ratings = {
	AAAAAA: '2,99 %',
	AAAAA: '3,99 %',
	AAAA: '4,99 %',
	AAA: '5,99 %',
	AAE: '6,99 %',
	AA: '8,49 %',
	AE: '9,49 %',
	A: '10,99 %',
	B: '13,49 %',
	C: '15,49 %',
	D: '19,99 %'
};

class App extends Component {
	state = {
		selectedRating: '',
		loans: [],
		isLoading: true
	};

	async componentDidMount() {
		this.setState({ isLoading: true });

		try {
			const result = await axios.get(`loans/marketplace`);
			this.setState({ isLoading: false, loans: result.data });
		} catch (error) {
			this.setState({
				error,
				isLoading: false
			});
		}
	}

	render() {
		const { isLoading, loans, selectedRating } = this.state;

		const filteredLoans = loans.filter(loan => loan.rating === selectedRating);
		const sumLoans = filteredLoans.reduce((acc, loan) => acc + loan.amount, 0);
		const averageLoan = sumLoans / filteredLoans.length;

		const ratingsButtons = Object.keys(ratings).map(ratingItem => {
			let buttonSelectedClassName = '';
			if (ratingItem === selectedRating) {
				buttonSelectedClassName = 'button-rating-selected';
			}

			return (
				<div
					key={ratingItem}
					className={`button-rating ${buttonSelectedClassName}`}
					onClick={() => {
						this.setState({ selectedRating: ratingItem });
					}}
				>
					{`${ratings[ratingItem]}`}
				</div>
			);
		});

		return (
			<div className="app">
				<h1>Zonky.cz</h1>
				<h2>Vyberte roční úrok</h2>

				{isLoading ? (
					<div>
						<div className="loading">
							<p>Načítání...</p>
						</div>
					</div>
				) : (
					<div>
						<div className="button-rating-list">{ratingsButtons}</div>
						{filteredLoans.length > 0 ? (
							<div>
								Při úroku {` ${ratings[selectedRating]}`} je průměrná výše
								půjček
								{` ${averageLoan
									.toFixed(2)
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} Kč.`}
							</div>
						) : selectedRating === '' ? null : (
							<div>
								Půjčky s touto úrokovou sazbou nejsou k dispozici. Vyberte jinou
								sazbu.
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}

export default App;
