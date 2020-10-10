import React, { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/add_items.css';
import data from '../../data/mydata.json';
import axios from 'axios';
import { ContextConsumer } from '../../context';

export default function () {

    const context = useContext(ContextConsumer);
    const { updateItem } = context;

    const [myCurrentItem, setMyCurrentItem] = useState({
        id: 0,
        Nbr: "",
        disegnation: "",
        "p.u": ""
    });

    const NbrRef = useRef(null);
    const disegnationRef = useRef(null);
    const p_uRef = useRef(null);

    useEffect(() => disegnationRef.current.focus(), []);
        function disegnationFocus(e) {
            if(e.key === 'Enter') {
                NbrRef.current.focus();
            }
        }
        function nbrFocus(e) {
            if(e.key === 'Enter') {
                p_uRef.current.focus();
            }
        }
        function p_uFocus(e) {
            if(e.key === 'Enter') {
            addNewItem();
        }
    }

    const setMyItemsState = e => {
        setMyCurrentItem({
            ...myCurrentItem,
           [e.target.name]: e.target.value
        });
    }

    const addNewItem = () => {
        if(!myCurrentItem.disegnation || !myCurrentItem.Nbr || !myCurrentItem["p.u"]) return;
        
        axios.post('http://localhost:4500/additem/add/item', {
            ...myCurrentItem,
            id: id + 1,
            total: myCurrentItem["p.u"] * myCurrentItem.Nbr
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    };
    
    let id = data.length;

    const totalPrixList = [];
    data.map(item => totalPrixList.push(parseInt(item.total)));
    const finalTotal = data.length ? totalPrixList.reduce((acc, val) => acc + val) : console.log('no items');

    const deleteItem = item => {
        axios.post('http://localhost:4500/deleteitem/del/item', {
            id: item.id
        }).then(res => console.log(res))
        .catch(err => console.log(err));
    }

    return (
        <div className="add-items">
            <div className="header">
                <Link to="/cash_register">Cash Register</Link>
                <h1>Add New Item</h1>
            </div>    
            <table className="content-table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>nom_de_produit</th>
                        <th>quantity</th>
                        <th>Prix_unitare</th>
                        <th>prix_total</th>
                        {/* <th>prix_de_vente</th>
                        <th>code_barre</th> */}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="user-input">
                    <tr>
                        <td name="id">
                            {id + 1}
                        </td>
                        <td>
                            <input 
                                name="disegnation"
                                type="text"
                                placeholder="nom de produit.."
                                value={myCurrentItem.nomDeProduit}
                                onChange={setMyItemsState}
                                ref={disegnationRef}
                                onKeyDown={disegnationFocus}
                                autoComplete="off"
                            />
                        </td>
                        <td>
                            <input 
                                name="Nbr"
                                placeholder="quntity.."
                                type="number"
                                min="0"
                                value={myCurrentItem.quantity}
                                onChange={setMyItemsState}
                                ref={NbrRef}
                                onKeyDown={nbrFocus}
                            />
                        </td>
                        <td>
                            <input 
                                name="p.u"
                                placeholder="prix.u"
                                type="number"
                                min="0"
                                value={myCurrentItem.prixUnit}
                                onChange={setMyItemsState}
                                ref={p_uRef}
                                onKeyDown={p_uFocus}
                            />
                        </td>
                        <td>
                            {myCurrentItem["p.u"] * myCurrentItem.Nbr}
                        </td>
                        {/* <td>
                            <input 
                                name="p.v"
                                placeholder="prix.v"
                            />
                        </td>
                        <td>
                            <input 
                                name="codeBar"
                                placeholder="code de barre"
                            />
                        </td> */}
                        <td></td>
                        <td>
                            {/* <button className="add-btn" onClick={addNewItem}>+</button> */}
                        </td>
                    </tr>
                </tbody>
                <tbody className="table-body">
                    {data.filter(item => {
                        let patt = new RegExp(myCurrentItem.disegnation.toLocaleUpperCase());
                        if(patt.test(item.disegnation.toLocaleUpperCase())) return item;
                        return "";
                    }).map((item, itemIndex) => {
                        id++;
                        return (
                            <tr key={itemIndex}>
                                <td>{item.id}</td>
                                <td>{item.disegnation}</td>
                                <td>{item.Nbr}</td>
                                <td>{item['p.u'] /* + ".00" */}</td>
                                <td>{item['total'] /* + ".00" */}</td>
                                <td><Link to="/update_items" className="upd" onClick={() => updateItem(item)}>update</Link></td>
                                <td><button className="del" onClick={() => deleteItem(item)}>delete</button></td>
                                {/* <td></td> */}
                            </tr>
                        );
                    })/*.reverse()*/}
                </tbody>
            </table>
            <div className="final-total">
                {finalTotal + " DZ"/* ? finalTotal + ".00"  : "0.00" */}
            </div>
        </div>
    );
}
