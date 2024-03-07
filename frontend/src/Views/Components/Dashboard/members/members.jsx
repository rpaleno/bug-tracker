import React from 'react'
import './members.css'


export default (props) => {
    const rowCount = 7;
    
    return (
            <div className='team-view'>
                <h1> Team </h1>
                <div className='table-container'>
                    <table className='member-table'>
                        <tbody>
                            {props.members.map((member, index) => (
                            <tr key={index}>
                                <td>{member.user.name}</td>
                                <td>{member.role}</td>
                            </tr>
                            ))}
                            {props.members.length < rowCount && (
                            Array(rowCount - props.members.length).fill(null).map((_, index) => (
                                <tr key={`empty-${index}`}>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                </tr>
                            ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
    )
}