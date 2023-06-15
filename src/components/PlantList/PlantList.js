import React, { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';


function PlantList() {
    const dispatch = useDispatch();

    const plantList = useSelector(store => store.plantList);

    const deletePlant = (id)=>{
        dispatch({type:'DELETE_PLANT', payload: id})
    }

    useEffect(() => {

        dispatch({type:'FETCH_PLANTS'});
        console.log('plant list =>',plantList);
    }, []); 

    return (
        <div>
            <h3>This is the plant list</h3>
            {plantList.map(plant=>(
                <>
                    <p key={plant.id}>{plant.name} - <button onClick={()=>deletePlant(plant.id)}> delete</button></p> 
                    
                </>
            ))}
            
        </div>
    );
}

export default PlantList;
