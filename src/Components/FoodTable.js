import React, { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import { IconButton, Typography, withStyles } from '@material-ui/core';
import '../App.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { Axios } from '../Axios';
import FormData from 'form-data';



const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});
const FoodTable = () => {
    const emptyFood = {
        ProductName: "",
        PriceGross: "",
        VAT: "",
        PriceNet: "",
        Stock: "",
        Image: ""
    }
    const [open, setOpen] = useState(false);
    const [food, setFood] = useState(emptyFood);
    const [edit, setEdit] = useState(false);
    const [image, setImage] = useState(null);
    const [foods, setFoods] = useState([])

    useEffect(() => {
        Axios.get('/retrive/foods')
            .then((res) => {
            setFoods(res.data);
        }).catch(err => {
            console.log(err);
        })
    },[])

    const addFood = async() => {
        const imgForm = new FormData()
        imgForm.append("file", image,)

        await Axios.post('upload/image', imgForm, {
            header: {
                "accept": "application/json",
                "Accept-Language": "en-us,en;q=0.8",
                "Content-Type": "multipart/form-data; boundary=" + imgForm._boundary,
            }
        }).then((res) => {
            console.log(res.data);
            const postData = {
                ProductName: food.ProductName,
                PriceGross: food.PriceGross,
                VAT: food.VAT,
                PriceNet: food.PriceNet,
                Stock: food.Stock,              
                Image: res.data.filename,

            }

            console.log(postData)
            savePost(postData)
        });
        setImage(null);
    }

    const savePost = async (postData) => {
        await Axios.post("add/food", postData)
            .then((res) => {
                console.log(res.data);
                setFoods([...foods, postData]);
                setFood(emptyFood);
                setOpen(false);
            })

    }
    const editFood = () => {
        let _foods = [...foods];
        let _food = { ...food };
        if (food._id) {
            const index = findIndexById(food._id);
            _foods[index] = _food;
        }
        Axios.patch(`edit/food?id=${food._id}`, food)
            .then(res => {
                setFoods(_foods);
                setEdit(false);
                setFood(emptyFood);
            }).catch(err => {
                console.log(err);
            })
    }


    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < foods.length; i++) {
            if (foods[i]._id === id) {
                index = i;
                break;
            }
        }

        return index;
    }
    const handleAddOpen = () => {
        setOpen(true);
    };
    const handleEditOpen = (item) => {
        setFood(item)
        setEdit(true);
    };
    const handleClose = () => {
        setOpen(false);
        setEdit(false)
        setFood(emptyFood)
    };

    const inputTextChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _food = { ...food };
        if (name === "PriceGross") {
            const net = val - ((val * _food.VAT) / 100)
            _food[`PriceNet`] = net;
        } else if (name === "VAT") {
            const net = _food.PriceGross - ((_food.PriceGross * val) / 100)
            _food[`PriceNet`] = net;
        }
        _food[`${name}`] = val;
        setFood(_food);
        console.log(food);
    }

    const inputFileChange = (e) => {
            if (e.target.files[0]) {
                setImage(e.target.files[0])
            }
    }

    return (
        <div className="my-2 mx-3">
            <h1 className="my-2">Products</h1>
            <button className="btn btn-light my-2" onClick={handleAddOpen}><AddIcon />Add</button>
            <table class="table table-bordered my-2 foodTable">
                <thead>
                    <tr>
                        <th scope="col">Product Name</th>
                        <th scope="col">Price(gross)</th>
                        <th scope="col">VAT</th>
                        <th scope="col">Price(net)</th>
                        <th scope="col">Total Stock</th>
                        <th scope="col">Image</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.ProductName}</td>
                                <td>{item.PriceGross + "$"}</td>
                                <td>{item.VAT + "%"}</td>
                                <td>{item.PriceNet + "$"}</td>
                                <td>{item.Stock}</td>
                                <td><img style={{ width: "auto", height: "70px" }} src={`https://aceinternational.herokuapp.com/retrive/image/single?name=${item.Image}`} alt="" /></td>
                                <td>
                                    <IconButton aria-label="edit" onClick={() => { handleEditOpen(item)}}>
                                        <EditIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <b>Products</b>
                </DialogTitle>
                <DialogContent dividers>
                    <form style={{width:"36vw"}}>
                        <div class="row mb-3">
                            <label for="ProductName" class="col-3 col-form-label">Product Name</label>
                            <div class="col-9">
                                <input type="text" class="form-control" id="ProductName" onChange={(e) => { inputTextChange(e, "ProductName") }} />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="VAT" class="col col-form-label">VAT</label>
                            <div class="col-9">
                                <select id="VAT" class="form-select" onChange={(e) => {inputTextChange(e,"VAT")}}>
                                    <option value={0} selected>Choose...</option>
                                    <option value={10}>10%</option>
                                    <option value={15}>15%</option>
                                    <option value={25}>25%</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="Quantity" class="col col-form-label">Quantity</label>
                            <div class="col-9">
                                <input type="text" class="form-control" id="Quantity" onChange={(e) => {inputTextChange(e,"Stock")}} />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="PriceGross" class="col col-form-label">Price(Gross)</label>
                            <div class="col-9">
                                <input type="text" class="form-control" id="PriceGross" onChange={(e) => { inputTextChange(e, "PriceGross") }}/>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="Image" class="col col-form-label">Image</label>
                            <div class="col-9">
                                <input type="file" class="form-control" id="Image" onChange={(e) => { inputFileChange(e) }} />
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <button type="button" class="btn btn-light" onClick={handleClose}>
                        <CloseIcon/>
                        Cancel
                     </button>
                    <button type="button" class="btn btn-primary" onClick={addFood}>
                        Save
                     </button>
                </DialogActions>
            </Dialog>


            <Dialog open={edit} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <b>Product</b>
                </DialogTitle>
                <DialogContent dividers>
                    <form style={{ width: "36vw" }}>
                        <div class="row mb-3">
                            <label for="ProductName" class="col-3 col-form-label">Product Name</label>
                            <div class="col-9">
                                <input type="text" class="form-control" id="ProductName" value={food.ProductName} onChange={(e) => { inputTextChange(e, "ProductName") }} />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="VAT" class="col col-form-label">VAT</label>
                            <div class="col-9">
                                <select id="VAT" class="form-select" value={food.VAT} onChange={(e) => { inputTextChange(e, "VAT") }}>
                                    <option value={0} selected>Choose...</option>
                                    <option value={10}>10%</option>
                                    <option value={15}>15%</option>
                                    <option value={25}>25%</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="Quantity" class="col col-form-label">Quantity</label>
                            <div class="col-9">
                                <input type="text" class="form-control" id="Quantity" value={food.Stock} onChange={(e) => { inputTextChange(e, "Stock") }} />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="PriceGross" class="col col-form-label">Price(Gross)</label>
                            <div class="col-9">
                                <input type="text" class="form-control" id="PriceGross" value={food.PriceGross} onChange={(e) => { inputTextChange(e, "PriceGross") }} />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="PriceNet" class="col col-form-label">Price(Net)</label>
                            <div class="col-9">
                                <input type="text" class="form-control" id="PriceNet" disabled value={food.PriceNet} />
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <button type="button" class="btn btn-light" onClick={handleClose}>
                        <CloseIcon />
                        Cancel
                     </button>
                    <button type="button" class="btn btn-primary" onClick={editFood}>
                        Save
                     </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default FoodTable;