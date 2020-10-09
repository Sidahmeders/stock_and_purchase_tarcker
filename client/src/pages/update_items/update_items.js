import React, { useState, useContext } from 'react';
import { ContextConsumer } from '../../context';
import '../../styles/update_items.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import codeBarSvg from '../../assets/icons/barcode-solid.svg';
import deleteSvg from '../../assets/icons/trash-alt-regular.svg';
import barcodesList from '../../data/barcodes.json';

export default function () {

    const context = useContext(ContextConsumer);
    const {itemToUpdate} = context;

    const [inputValue, setInputValue] = useState({
        id: itemToUpdate.id,
        disegnation: itemToUpdate.disegnation,
        quantity: itemToUpdate.Nbr,
        prix_unitare: itemToUpdate['p.u'],
        prix_de_vente: itemToUpdate['p.v'] || "",
        codeBarVal: "",
        codeBarArray: itemToUpdate.codeBarList || []
    });

    const updateInputValue = e => {
        const name = e.target.name;
        const val = e.target.value;
        setInputValue(() => {
            return {
                ...inputValue,
                [name]: val
            }
        });
    }

    const addNewCodeBar = () => {
        if(inputValue.codeBarArray.indexOf(inputValue.codeBarVal) >= 0) return;
        if(barcodesList.indexOf(inputValue.codeBarVal) >= 0) return;
        setInputValue(() => {
            return {
                ...inputValue,
                codeBarVal: "",
                codeBarArray: [
                    ...inputValue.codeBarArray,
                    inputValue.codeBarVal
                ]
            }
        });
    }

    function codeBarFocus(e) {
        if(e.key === 'Enter') {
            addNewCodeBar();
        }
    }

    const updateMyItem = () => {
        axios.post('http://localhost:4500/updateitem/update/item', {
            id: inputValue.id,
            disegnation: inputValue.disegnation,
            Nbr: inputValue.quantity,
            "p.u": inputValue.prix_unitare,
            "p.v": inputValue.prix_de_vente,
            total: inputValue.prix_unitare * inputValue.quantity,
            codeBarList: inputValue.codeBarArray
        })
        .then(res => {
            console.log(res);
            window.location = '/add_items';
        })
        .catch(err => console.log(err));
    }

    const deleteBarcode = barcode => {
        if(inputValue.codeBarArray.indexOf(barcode) >= 0) {
            setInputValue(() => {
                return {
                    ...inputValue,
                    codeBarArray: inputValue.codeBarArray.filter(bc => bc !== barcode)
                }
            });
        }
    }

    return (
        <div className="update-items">
            <h1>update your item</h1>
            <div className="item-info">
                <div>
                    <label>ID</label>
                    <span>{inputValue.id}</span>
                </div>
                <div>
                    <label>new barcode</label>
                    <input 
                        name="codeBarVal"
                        placeholder="###"
                        type="number"
                        value={inputValue.codeBarVal || ""}
                        onChange={updateInputValue}
                        onKeyDown={codeBarFocus}
                    />
                </div>
                {inputValue.codeBarArray.length ? 
                (
                    <div className="barcode-list">
                        <label>barcode list</label>
                        <div className="barcode">
                            {inputValue.codeBarArray.map((barCode, index) => {
                                return (
                                    <div key={index}>
                                        <span>{barCode}</span>
                                        <img 
                                            className="barcode-btn"
                                            src={deleteSvg}
                                            width="20px"
                                            onClick={() => deleteBarcode(barCode, inputValue.id)} 
                                        />
                                    </div>
                                );
                            }).reverse()}
                        </div>
                    </div>
                ) :
                    <div className="empty-barcode">
                        <label>No barcode found</label>
                        <img src={codeBarSvg} width="45px" alt="barcode" />
                    </div>
                }
                <div>
                    <label>nom de produit</label>
                    <input  
                        name="disegnation"
                        type="text"
                        value={inputValue.disegnation || ""} 
                        onChange={updateInputValue}
                        autoComplete="new-password"
                    />
                </div>
                <div>
                    <label>quantity</label>
                    <input  
                        name="quantity"
                        type="number"
                        value={inputValue.quantity || ""} 
                        onChange={updateInputValue}
                    />
                </div>
                <div>
                    <label>prix unitare</label>
                    <input  
                        name="prix_unitare"
                        type="number"
                        value={inputValue.prix_unitare /* + ".00" */ || ""} 
                        onChange={updateInputValue}
                    />
                </div>
                <div>
                    <label>prix de vente</label>
                    <input 
                        name="prix_de_vente"
                        type="number"
                        value={inputValue.prix_de_vente}
                        onChange={updateInputValue || ""}
                    />
                </div>
                <div>
                    <label>total</label>
                    <span>{inputValue.prix_unitare * inputValue.quantity /* + ".00" */ || ""}</span>
                </div>
                <button onClick={updateMyItem}>submit the change</button>
                <Link to="/add_items">cancel</Link>
            </div>
        </div>
    );
}
