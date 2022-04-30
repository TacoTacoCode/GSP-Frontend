import React from 'react'

const ProgressBar = ({ bgcolor, progress, height, fgcolor }) => {

    const Parentdiv = {
        height: height,
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
    }

    const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: bgcolor,
        borderRadius: 40,
        textAlign: 'right'
    }

    const progresstext = {
        height: '100%',
        color: fgcolor,
        fontWeight: 900,
    }

    return (
        <div style={Parentdiv}>
            <div style={Childdiv}>
                <div style={progresstext}><div style={{ verticalAlign: "middle", padding: "5px" }}>{`${progress}%`}</div></div>
            </div>
        </div>
    )
}

export default ProgressBar;