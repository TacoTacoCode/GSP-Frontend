import { Icon } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';


export const SideBarAdminData = [
    {
        title: 'Dashboard',
        // icon: <DashboardIcon />,
        path: "/",
        cName: 'nav-text'
    },
    {
        title: "Manage Sections",
        // icon: <DashboardIcon />,
        path: "/dashboard/sections",
        cName: 'nav-text'
    },
    {
        title: "Manage Accounts",
        // icon: <DashboardIcon />,
        path: "/dashboard/accounts",
        cName: 'nav-text'
    },
    {
        title: "Manage Products",
        // icon: <DashboardIcon />,
        path: "/dashboard/products",
        cName: 'nav-text'
    },
    {
        title: "Manage Components",
        // icon: <DashboardIcon />,
        path: "/dashboard/components",
        cName: 'nav-text'
    },
    {
        title: "Manage Materials",
        // icon: <DashboardIcon />,
        path: "/dashboard/materials",
        cName: 'nav-text'
    }
]

export const SideBarOrderData = [
    {
        title: 'Manage Orders',
        // icon: <DashboardIcon />,
        path: "/orders",
        cName: 'nav-text'
    },
    {
        title: 'Manage Delivery',
        // icon: <DashboardIcon />,
        path: "/delivery",
        cName: 'nav-text'
    },
    {
        title: "Manage Products",
        // icon: <DashboardIcon />,
        path: "/dashboard/products",
        cName: 'nav-text'
    },
    {
        title: "Tracking Plans",
        // icon: <DashboardIcon />,
        path: "/manufacturer/process",
        cName: 'nav-text'
    },
]

export const SideBarSectionAssembleData = [
    {
        title: 'Task List',
        path: "/section/processDetail",
        cName: "nav-text"
    },
    {
        title: 'Request List',
        path: "/section/requests",
        cName: "nav-text"
    },
    {
        title: 'Tracking Component',
        path: "/section/tasks",
        cName: "nav-text"
    },
    {
        title: 'Workers List',
        path: "/section/workers",
        cName: "nav-text"
    },
    {
        title: "Manage Products",
        // icon: <DashboardIcon />,
        path: "/dashboard/products",
        cName: 'nav-text'
    },
    {
        title: "Manage Components",
        path: "/dashboard/components",
        cName: 'nav-text'
    }
]

export const SideBarSectionData = [
    {
        title: 'Task List',
        path: "/section/processDetail",
        cName: "nav-text"
    },
    {
        title: 'Request List',
        path: "/section/requests",
        cName: "nav-text"
    },
    {
        title: 'Materials List',
        path: "/section/materials",
        cName: "nav-text"
    },
    {
        title: 'Workers List',
        path: "/section/workers",
        cName: "nav-text"
    },
    {
        title: "Component Producting",
        path: "/section/components",
        cName: 'nav-text'
    }
]


export const SideBarManuData = [
    {
        title: "Request Component",
        path: "/manufacturer/requestComponent",
        cName: "nav-text"
    },
    {
        title: "Manage Components",
        path: "/dashboard/components",
        cName: 'nav-text'
    },
    {
        title: "Manage Products",
        // icon: <DashboardIcon />,
        path: "/dashboard/products",
        cName: 'nav-text'
    },
    {
        title: "Manage Materials",
        // icon: <DashboardIcon />,
        path: "/dashboard/materials",
        cName: 'nav-text'
    },
    {
        title: "Tracking Plans",
        // icon: <DashboardIcon />,
        path: "/manufacturer/process",
        cName: 'nav-text'
    },
]