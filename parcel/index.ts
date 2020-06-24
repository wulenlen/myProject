import {User} from './User'
import {Company} from './Company'
import {Map} from './Map'

const user = new User(),
    company = new Company(),
    map = new Map('map')

map.addMarker(user.location)
map.addMarker(company.location)

// console.log(user, company)

