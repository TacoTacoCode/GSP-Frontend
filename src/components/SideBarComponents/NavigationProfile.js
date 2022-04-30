import React from "react";
import '../../styles/component.scss'
import Avatar from '@mui/material/Avatar';

class NavigationProfile extends React.Component {
    render() {
        let role = this.props.role;
        let image = this.props.image;
        return (
            <div className="navigation_profile">
                <nav className="column">
                    <ul>
                        <li><Avatar src={image} sx={{ width: '180px', height: '180px' }} /></li>
                        {
                            (role != 'Admin')
                                ? <li><center><button
                                    onClick={() => {
                                        localStorage.setItem('choiceUser', localStorage.getItem('currUser'))
                                        window.location.href = '/dashboard/attendance'
                                    }}
                                    className="button_nav">Attendance
                                </button></center></li>
                                : ""
                        }
                        </ul>
                </nav>
            </div>
        )
    }
}

export default NavigationProfile;