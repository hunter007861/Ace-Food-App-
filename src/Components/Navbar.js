import React from 'react';
import FlagIcon from '@material-ui/icons/Flag';

const Navbar = () => {
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="/"><FlagIcon /></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active font-monospace" aria-current="page" href="/">CURD</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link font-monospace" href="/">Text</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link font-monospace" aria-current="page" href="/">Settings</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link font-monospace" href="/">About</a>
                        </li>
                    </ul>
                    <div >

                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;