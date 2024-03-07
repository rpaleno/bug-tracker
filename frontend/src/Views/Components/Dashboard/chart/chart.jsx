import React,{useEffect, useState} from 'react'
import { filterBugs, drawChart } from './methods/methods'
import './chart.css'

export default (props)=> {
  const [highCount, setHighCount] = useState([])
  const [midCount, setMidCount] = useState([])
  const [lowCount, setLowCount] = useState([])

  useEffect(() => {
    setHighCount(filterBugs(props.bugs, '1'));
    setMidCount(filterBugs(props.bugs, '2'));
    setLowCount(filterBugs(props.bugs, '3'));
  }, [props.bugs])

  const handleResize = () => {
    drawChart(lowCount, midCount, highCount);
  };

  useEffect(() => {
      const google = window.google;

      if (props.bugs.length > 0) {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(() => {
        drawChart(lowCount, midCount, highCount);
      });
    
      window.addEventListener('resize', handleResize);
    
      return () => {
        //remove the resize event listener when the component is unmounted
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [lowCount, midCount, highCount, props.bugs]);
  
  return (
    <div className='parent'>
      {props.bugs.length === 0 ? (
        <div className="chart-placeholder">No bugs</div>
        
      ) : (
        <div id="piechart_3d"></div>
      )}
    </div>
  )
}