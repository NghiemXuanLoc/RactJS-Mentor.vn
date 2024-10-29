import React, {useState, useEffect, useContext} from "react";
import { context } from "../../contexts/ProviderLogin";

function UserDetail ({user}){

    const {getRoleByRoleId} = useContext(context);
    return (
        <>
            <table className="table table-hover table-striped">
                <tr>
                    <td>UserName</td>
                    <td>{user?.username}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{user?.email}</td>
                </tr>
                <tr>
                    <td>PhoneNumber</td>
                    <td>{user?.phoneNumber}</td>
                </tr>
                <tr>
                    <td>Role</td>
                    <td>{getRoleByRoleId(user?.roleId)?.name}</td>
                </tr>
                <tr>
                    <td>Address</td>
                    <td>{user?.address}</td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>{user?.description}</td>
                </tr>
            </table>
        </>
    )
}

export default UserDetail;