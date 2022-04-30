import React from "react";
import '../../styles/component.scss'

class FooterPage extends React.Component {
    render() {
        return (
            <footer className="site-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            {/* nhập về công ty uyên phát */}
                            <h6>About</h6>
                            <p className="text-justify">Scanfcode.com <i>CODE WANTS TO BE SIMPLE </i> is an initiative  to help the upcoming programmers with the code. Scanfcode focuses on providing the most efficient code or snippets as the code wants to be simple. We will help programmers build up concepts in different programming languages that include C, C++, Java, HTML, CSS, Bootstrap, JavaScript, PHP, Android, SQL and Algorithm.</p>
                        </div>

                        <div className="col-xs-6 col-md-3" />
                        <div className="col-xs-6 col-md-3" />
                    </div>
                    <hr />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-sm-6 col-xs-12">
                            <p className="copyright-text">Copyright &copy; 2022 All Rights Reserved by&nbsp;
                                <a href=".">GSP</a>.
                            </p>
                        </div>
                        <div className="col-md-4 col-sm-6 col-xs-12" />
                    </div>
                </div>
            </footer>
        )
    }
}

export default FooterPage;