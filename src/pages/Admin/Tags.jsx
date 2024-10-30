import React, { useState, useEffect, useContext } from "react";
import { context } from "../../contexts/ProviderLogin";
import axios from "axios";
import { toast } from "react-toastify";

function Tags() {

    const { tags, setTags } = useContext(context);

    const [updateTag, setUpdateTag] = useState({});

    const [newTag, setNewTag] = useState({
        "name": "",
        "isDeleted": false
    })
    var tagsFilter = tags.filter(tag => tag.isDeleted == false);

    const handleDelete = async (tag) => {
        tag.isDeleted = true;
        await updateTags(tag);
        await fetchTags();

    }
    const updateTags = async (tag) => {
        await axios.put(`http://localhost:9999/tags/${tag.id}`, tag);
    };

    const fetchTags = async () => {
        const response = await axios.get('http://localhost:9999/tags');
        setTags(response.data);
    };

    const handleUpdate = async () => {
        var checkExist = false;
        tags.forEach(tag => {
            if (tag.name.toLowerCase().trim() == updateTag.name.toLowerCase().trim() && tag.id != updateTag.id) {
                checkExist = true;
            }
        })

        if (checkExist) {
            toast.error("Tag name exist");
        } else {
            await updateTags(updateTag);
            await fetchTags();
            toast.success("Update tag success");
        }
    }

    const createTag = async (tag) => {
        await axios.post('http://localhost:9999/tags', tag);
    };

    const handleCreate = async () => {

        console.log(newTag);
        var checkExist = false;
        tags.forEach(tag => {
            if (tag.name.toLowerCase().trim() == newTag.name.toLowerCase().trim()) {
                checkExist = true;
            }
        })

        if (newTag.name == '') {
            toast.error("Tag name not empty");
        } else if (checkExist) {
            toast.error("Tag name exist");
        } else {
            await createTag(newTag);
            await fetchTags();
            toast.success("Create tag success");
        }
    }

    return (
        <>
            <h2>Tags</h2>

            <button
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                className="btn btn-success mb-3">Create Tags</button>
            <table className="table table-hover table-striped">
                <thead>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Action</th>
                </thead>

                <tbody>
                    {
                        tagsFilter.map((tag, index) => {
                            return (<tr>
                                <td>{index + 1}</td>
                                <td>{tag.name}</td>
                                <td>
                                    <button
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => setUpdateTag(tag)}
                                    >Update</button>
                                    <button onClick={() => handleDelete(tag)} className="btn btn-sm btn-danger ms-2">Delete</button>
                                </td>
                            </tr>);
                        })
                    }
                </tbody>
            </table>


            <>
                <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Update tag
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <input
                                    value={updateTag.name}
                                    onInput={(e) => setUpdateTag({ ...updateTag, "name": e.target.value })}
                                    type="text" className="form-control" />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button onClick={handleUpdate} type="button" className="btn btn-primary">
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>


            <>
                <div
                    className="modal fade"
                    id="exampleModal2"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Create tag
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <input
                                    value={newTag.name}
                                    onInput={(e) => setNewTag({ ...newTag, "name": e.target.value })}
                                    type="text" className="form-control" />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button onClick={handleCreate} type="button" className="btn btn-primary">
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        </>


    )
}

export default Tags;