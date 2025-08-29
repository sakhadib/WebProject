import './Sidebar.css';
function Sidebar(){
    return (
        <div class="sidebar">
            <a class="active" href="#home">Home</a>
            <a href="#news">News</a>
            <a href="#contact">Contact</a>
            <a href="#about">About</a>
            
            <div>Display Name</div>
            <div><p>Username</p></div>
            <div><p>Bio</p></div>
            <div class="contact">Contact</div>
            <div><button>Edit Profile</button></div>
            <div>stats</div>

        </div>
        // Page content -->
    );
}
export default Sidebar;