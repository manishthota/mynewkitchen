import {RiArrowDropLeftLine, RiArrowDropRightLine} from 'react-icons/ri'

import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import RestaurantHeader from '../RestaurantHeader'
import RestaurantCard from '../RestaurantCard'

import './index.css'

const sortByOptions = [
  {
    id: 1,
    displayText: 'Highest',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest',
    value: 'Lowest',
  },
]

class PopularRestaurants extends Component {
  state = {
    restaurantList: [],
    isLoading: false,
    selectedSortByValue: sortByOptions[1].value,
    activePage: 1,
    searchInput: '',
  }

  componentDidMount() {
    this.getRestaurants()
  }

  getRestaurants = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {selectedSortByValue, activePage} = this.state
    const limit = 9
    const offset = (activePage - 1) * limit
    const url = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${limit}&sort_by_rating=${selectedSortByValue}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = fetchedData.restaurants.map(restaurant => ({
        costForTwo: restaurant.cost_for_two,
        cuisine: restaurant.cuisine,
        groupByTime: restaurant.group_by_time,
        hasOnlineDelivery: restaurant.has_online_delivery,
        hasTableBooking: restaurant.has_table_booking,
        id: restaurant.id,
        imageUrl: restaurant.image_url,
        isDeliveringNow: restaurant.is_delivering_now,
        location: restaurant.location,
        menuType: restaurant.menu_type,
        name: restaurant.name,
        opensAt: restaurant.opens_at,
        userRating: restaurant.user_rating,
      }))
      this.setState({
        restaurantList: updatedData,
        isLoading: false,
      })
    }
  }

  updateSelectedSortByValue = selectedSortByValue => {
    this.setState({selectedSortByValue}, this.getRestaurants)
  }

  onClickLeftArrow = () => {
    const {activePage} = this.state
    if (activePage > 1) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage - 1,
        }),
        this.getRestaurants,
      )
    }
  }

  onClickRightArrow = () => {
    const {activePage} = this.state
    if (activePage <= 4) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage + 1,
        }),
        this.getRestaurants,
      )
    }
  }

  onChangeSearchInput = input => {
    this.setState({searchInput: input})
  }

  renderRestaurants = () => {
    const {
      restaurantList,
      selectedSortByValue,
      activePage,
      searchInput,
    } = this.state
    const updatedList = restaurantList.filter(each =>
      each.name.toLowerCase().includes(searchInput.toLowerCase()),
    )
    return (
      <>
        <RestaurantHeader
          selectedSortByValue={selectedSortByValue}
          sortByOptions={sortByOptions}
          updateSelectedSortByValue={this.updateSelectedSortByValue}
          onChangeSearchInput={this.onChangeSearchInput}
        />
        <hr className="line" />
        {updatedList.length === 0 ? (
          <div className="no-restaurants-container">
            <h1 className="no-res-heading">No Restaurants Found</h1>
          </div>
        ) : (
          <>
            <ul className="restaurants-list">
              {updatedList.map(restaurant => (
                <RestaurantCard
                  restaurantData={restaurant}
                  key={restaurant.id}
                />
              ))}
            </ul>
            <div className="pagination">
              <button
                testid="pagination-left-button"
                className="button"
                type="button"
                onClick={this.onClickLeftArrow}
              >
                <RiArrowDropLeftLine className="arrow" />
              </button>
              <h1 testid="active-page-number" className="page-numbers">
                {activePage}
              </h1>
              <button
                testid="pagination-right-button"
                className="button"
                type="button"
                onClick={this.onClickRightArrow}
              >
                <RiArrowDropRightLine className="arrow" />
              </button>
            </div>
          </>
        )}
      </>
    )
  }

  renderLoader = () => (
    <div testid="restaurants-list-loader" className="carousel-loader">
      <Loader type="TailSpin" color="#F7931E" height={50} width={50} />
    </div>
  )

  render() {
    const {isLoading} = this.state
    return isLoading ? this.renderLoader() : this.renderRestaurants()
  }
}

export default PopularRestaurants
