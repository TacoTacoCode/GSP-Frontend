import React, { useState, useEffect } from "react";
import { TabLink, Tabs, TabContent } from "react-tabs-redux";
import NavigationProfile from "../SideBarComponents/NavigationProfile";
import ProfileEditPopup from "../Popups/ProfileEditPopup";
import '../../styles/Profile.scss';
import * as FaIcons from 'react-icons/fa';
import {
    Button,
    TextField,
} from "@mui/material";
import axios from "axios";

function Profile() {
    useEffect(() => {
        document.title = "UFA - My Profile"
    }, []);

    const currentRole = localStorage.getItem('currentRole');
    const currentUserID = localStorage.getItem('currentId');
    const [currentUser, setCurrentUser] = useState({});
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}getAccountById/` + currentUserID)
            .then((res) => {
                setCurrentUser(res.data);
            });
    }, []);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}getRoles`)
            .then((res) => {
                setRoles(res.data);
            });
    }, [])

    const [editDatas, setEditDatas] = useState(null);
    const [open, setOpen] = useState(false);

    const handleEditProfile = (currentUserEdit) => {
        setEditDatas(currentUserEdit);
        setOpen(true);
    }

    return (
        <div className="profile-background">
            <section className="mid_panel">
                {/* Left */}
                <NavigationProfile
                    name={currentUser.name}
                    role={currentRole}
                    image={"https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + currentUser.avatarUrl}
                />
                <div className="row">
                    {/* Right 1 */}
                    <div className="row1">
                        <div className="row1_inside">
                            <div className="inline_row1">
                                <br />
                                <h3 className="row1_h3">Full Name:&emsp;{currentUser.name}</h3>
                                <br />
                                <h4 className="row1_h4">Role:&emsp;
                                    {
                                        roles.map((item) => {
                                            if (item.roleId == currentUser.roleId) {
                                                return item.name
                                            }
                                        })
                                    }
                                </h4>
                            </div>
                            <div className="inline_row2">
                                <span className="span_1">
                                    <button className="button_edit_profile" onClick={() => handleEditProfile(currentUser)}>Edit Profile</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Right 2 */}
                    <div className="row2">
                        {/* Tab */}
                        <Tabs className="profile-tabs profile-tabs-1">
                            <div className="profile-tab-links">
                                <TabLink to="profile-tab1">About</TabLink>
                                <TabLink to="profile-tab2">Working Information</TabLink>
                            </div>

                            <div className="profile-content">
                                <TabContent for="profile-tab1">
                                    <div className="row2_inside">
                                        <div className="inline2_row1">
                                            <h3 className="row2_h5">Phone</h3>
                                        </div>
                                        <div className="inline2_row2">
                                            <span className="span_1">
                                                <input type="number" placeholder={currentUser.phone} className="textbox_input" defaultValue={currentUser.phone} readOnly={true}></input>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row2_inside">
                                        <div className="inline2_row1">
                                            <h3 className="row2_h5">Email</h3>
                                        </div>
                                        <div className="inline2_row2">
                                            <span className="span_1">
                                                <input type="text" placeholder={currentUser.email} className="textbox_input" defaultValue={currentUser.email} readOnly={true}></input>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row2_inside">
                                        <div className="inline2_row1">
                                            <h3 className="row2_h5">Address</h3>
                                        </div>
                                        <div className="inline2_row2">
                                            <span className="span_1">
                                                <input type="text" placeholder={currentUser.address} className="textbox_input" defaultValue={currentUser.address} readOnly={true}></input>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row2_inside">
                                        <div className="inline2_row1">
                                            <h3 className="row2_h5">Gender</h3>
                                        </div>
                                        <div className="inline2_row2">
                                            <span className="span_1">
                                                <input type="text" placeholder={currentUser.gender} className="textbox_input"
                                                    defaultValue={(currentUser.gender == true) ? "Male" : "Female"}
                                                    readOnly={true}></input>
                                            </span>
                                        </div>
                                    </div>
                                </TabContent>
                                <TabContent for="profile-tab2">
                                    <div className="row2_inside">
                                        <div className="inline2_row1">
                                            <h3 className="row2_h5">Worker ID</h3>
                                        </div>
                                        <div className="inline2_row2">
                                            <span className="span_1">
                                                <input type="text" placeholder={currentUser.accountId} className="textbox_input" defaultValue={currentUser.accountId} readOnly={true}></input>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row2_inside">
                                        <div className="inline2_row1">
                                            <h3 className="row2_h5">Role</h3>
                                        </div>
                                        <div className="inline2_row2">
                                            <span className="span_1">
                                                {
                                                    roles.map((item) => {
                                                        if (item.roleId == currentUser.roleId) {
                                                            return (<input type="text" placeholder={currentUser.role} className="textbox_input"
                                                                defaultValue={item.name}
                                                                readOnly={true}></input>)
                                                        }
                                                    })
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </TabContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </section>
            {editDatas &&
                <ProfileEditPopup
                    data={editDatas}
                    setData={setEditDatas}
                    IsOpen={open}
                    setOpen={setOpen}
                >
                    <h3 className="popuptitle">Edit Profile : {editDatas.name} </h3>
                </ProfileEditPopup>
            }
        </div>
    )
}

export default Profile;