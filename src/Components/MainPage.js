import React from 'react';
import {Col, Row} from 'react-bootstrap';
import CourseCart from './CourseCart';
import CourseSelection from './CourseSelection';
import MapModal from './MapModal';
import {fetchAllCourses} from '../api/courses-api';

  // Remove course types from within a season
  // BE input should be provided in a simpler way:  {Fall: [all courses], Winter: [all courses]}
  const getAllSeasonCourses = (seasonCourses) => {
    let allSeasonCourses = [];
    for (let classType in seasonCourses){ 
      const classTypeList = seasonCourses[classType];
      for (let i=0; i<classTypeList.length;i++){ //i is the course itself
        allSeasonCourses.push(classTypeList[i]);
      }
    }
    return allSeasonCourses;
  }


export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allCourses:[],
            // allCourses:[
            //     {id:0, code:'LIFESCI 1D03', name:'Medical Imaging Physics'},
            //     {id:1, code:'CHEM 1A03', name:'Introductory Chemistry I'},
            // ],
            fallCourses:[],
            selectedCourses:[],
            modalShown: false,
            selectedSeason:"fall"
            };

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.addCourseToCart = this.addCourseToCart.bind(this);
        this.removeCourseFromCart = this.removeCourseFromCart.bind(this);
        this.onSeasonChange = this.onSeasonChange.bind(this);
    }

    //add springSummer when BE accounts for the same group
    componentDidMount(){
        fetchAllCourses().then(res => {
          const allCourses = [
            {fall: getAllSeasonCourses(res.data.courseLists.Fall)}, 
            {winter: getAllSeasonCourses(res.data.courseLists.Winter)},
          ];
          this.setState({allCourses});
          console.log(allCourses);
        })
        .catch((err) => {
          console.log("AXIOS ERROR: ", err);
      })
    }

    //confirm caps situation of class list object indexing
    onSeasonChange(season){
        this.setState({season});
      }
  
  

    addCourseToCart(courseId){
        const {selectedCourses, allCourses, season} = this.state;
        console.log('ffff',allCourses[0]);
        const newCourseIndex = allCourses[0].fall.findIndex(course => course.courseID === courseId);
       
        this.setState({
            selectedCourses: [...selectedCourses, allCourses[0].fall[newCourseIndex]],
            allCourses: [...allCourses, allCourses[0].fall[newCourseIndex].selected=true]
        });
    }

    removeCourseFromCart(courseId){
        const {allCourses, selectedCourses, season} = this.state;
        const courseIndex = allCourses[0].fall.findIndex(course => course.courseID === courseId);

        const updatedCourseList = selectedCourses.filter(function( course ) {
            return course.courseID !== courseId;
        });
          
        this.setState({
            selectedCourses: updatedCourseList,
            allCourses:[...allCourses, allCourses[0].fall[courseIndex].selected=false]
        });
    }




    showModal() {
        this.setState({ modalShown: true});
    }

    hideModal() {
        this.setState({ modalShown: false});
    }

    render() {
        const {allCourses, selectedCourses} = this.state;
        return(
            <div className="container-fluid">
            <Row>
                <Col sm={12} md={9}>
                    <CourseSelection allCourses={allCourses} addCourseToCart={this.addCourseToCart} onSeasonChange={this.onSeasonChange}/> 
                </Col>

                <Col sm={12} md={3}>
                    {/* <div className="sample-fill"/> */}
                    <CourseCart showResults={this.showModal} selectedCourses={selectedCourses} removeCourseFromCart={this.removeCourseFromCart}/>

                </Col>
            </Row>

            {this.state.modalShown &&
            <MapModal hideModal={this.hideModal}> </MapModal>
            }
            </div>
      );
    }
  }
  