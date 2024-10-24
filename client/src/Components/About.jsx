import React, { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';

const About = () => {
    useEffect(()=>{
        window.document.title="About Us"
    },[])
    const token = localStorage.getItem("userlogintoken");
    const admintoken = localStorage.getItem("adminlogintoken");
    let id = "";
    if (token) {
        const decoded = jwtDecode(token);
        id = decoded.userId
    }

    else if (admintoken) {
        const decoded = jwtDecode(admintoken);
        id = decoded.adminId;
    }

    return (
        <div className='about'>
            <div className='abt'>
                <div className="image-container">

                    <img className='img' src="https://t3.ftcdn.net/jpg/07/52/70/74/360_F_752707422_6wyWHXR0SRmVyvmR2NCObNTW7RbCmSKq.jpg" alt="" />
                    <div className="moreabt">
                        <h1>Desigers,Thinkers And Collaorators</h1>
                        <h3>Who we are</h3>
                    </div>
                </div>
            </div>

            <div>
                <div className='welcome'>
                    <h1>Welcome to <span style={{ color: "#7E22CE" }}>CableGuy!</span></h1>
                    <p>At CableGuy, we are dedicated to providing exceptional service and support in the cable industry. Our platform is designed to streamline the customer experience, making it easier for users to manage their cable services with just a few clicks.</p>
                </div>
                <div className='cableguy'>
                    <h1>About <span style={{ color: "#7E22CE" }}>Us</span></h1>
                    <p>Cableguy Technology  introduces cutting-edge digital cable billing and accounting software tailored for cable operators. Our innovative solution offers a comprehensive suite of tools to seamlessly manage both analog and digital operations, complete with essential features such as work order and inventory management. With this software, you're empowered to efficiently oversee Set-Top Boxes (STBs), authorizations, service activations, and packages.
                        <br />
                        Experience streamlined digital cable billing that simplifies the tracking of incoming and outgoing payments, all with comprehensive, detailed information. Our software serves as an all-inclusive solution that revolutionizes the way cable operators manage their processes, ensuring accuracy and efficiency every step of the way.</p>
                </div>
                <div className='abt_details'>
                    <div className='abt_details_sec1'>
                        <h1>How Coding Works</h1>
                        <div className='userdet'>
                            <p>Jaswant Singh</p><p>-10/21/2024</p>
                        </div>
                        <div>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem inventore quod corrupti reprehenderit, explicabo harum aut quia dolore architecto eligendi ea sit ipsum nobis omnis.</p>
                        </div>
                        <div className='abtbtn'>
                            <button>See here</button>
                        </div>
                    </div>
                    <div className='abt_details_sec1'>
                        <h1>How Coding Works</h1>
                        <div className='userdet'>
                            <p>Jaswant Singh</p><p>-10/21/2024</p>
                        </div>
                        <div>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem inventore quod corrupti reprehenderit, explicabo harum aut quia dolore architecto eligendi ea sit ipsum nobis omnis.</p>
                        </div>
                        <div className='abtbtn'>
                            <button style={{ backgroundColor: "#7E22CE" }}>See here</button>
                        </div>
                    </div>
                    <div className='abt_details_sec1'>
                        <h1>How Coding Works</h1>
                        <div className='userdet'>
                            <p>Jaswant Singh</p><p>-10/21/2024</p>
                        </div>
                        <div>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem inventore quod corrupti reprehenderit, explicabo harum aut quia dolore architecto eligendi ea sit ipsum nobis omnis.</p>
                        </div>
                        <div className='abtbtn'>
                            <button>See here</button>
                        </div>
                    </div>
                </div>
                <div className='mission'>
                    <h1>Our <span style={{ color: "#7E22CE" }}>Mission</span></h1>
                    <div className='mission_img'><img src="https://img.freepik.com/premium-photo/concept-mission-with-network-business-symbols_220873-12797.jpg" alt="" />
                    </div>
                    <p>Our mission is to simplify cable management for everyone. We believe that managing your cable services should be effortless, allowing you to focus on what matters most—enjoying your entertainment. We strive to offer a user-friendly platform that empowers our customers to take control of their cable services.</p>
                </div>
                <div className='offers'>
                    <h1>What We <span style={{ color: "#7E22CE" }}>Offer</span></h1>
                    <div className='offer'>
                        <p>Comprehensive Management Tools: <span> From account management to service modifications, our tools are tailored to meet the diverse needs of our users. We provide features like user login, account settings, and subscription management, all in one place.</span></p>
                        <p>Role Based Access: <span> Our system supports both user and admin roles, allowing for seamless interaction and management of services. Admins can efficiently oversee operations, while users enjoy personalized service.</span></p>
                        <p>User-Friendly Interface: <span> Our platform features a clean and intuitive design, ensuring a smooth experience for all users, regardless of their technical background.</span></p>
                        <p>Reliable Support: <span>We understand that questions may arise, and our dedicated support team is here to assist you every step of the way. We value your feedback and continuously work to enhance our services.</span></p>
                    </div>
                </div>
                <h1 style={{ textAlign: "center", marginTop: "80px" }}>Testi<span style={{ color: "#7E22CE" }}>monials</span></h1>
                <div className="testimonials">

                    <div className="test">

                        <p>I don't have words to thank this man, I'm really grateful to have this channel and website in my daily routine. If you're a mere beginner, then you can trust this guy and can put your time into his content. I can assure you that it'll be worth it.</p>
                        <div className='test_user'>
                            <h3>Jaswant Singh</h3>
                            <h4>Jr Software Developer</h4>
                        </div>
                    </div>
                    <div className="test">
                        <p>For everyone who wants to level up their #Coding and #Dev skills - seriously, this channel is for you! Both basic and advanced stacks are covered on this channel, and one can learn according to his skill levels. And the icing on the cake is, everything is available for free.</p>
                        <div className='test_user'>
                            <h3>Jaswant Singh</h3>
                            <h4>Jr Software Developer</h4>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default About
