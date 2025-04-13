import mongoose, {model, Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // the user to which the user is subscribing.
        ref: "User"
    },

    // dono subscriber and channel hain to user hi. hr baar ek subscriber kisi channel ko subscribe krta hai, a new document gets created. us document me subscriber aur channel hoga according to this model.
    // jb bhi koi user ek subscriber bnke kisi channel ko subscribe kr rha hai to ek naya document bnega. aur hr subscriber ke liye different document banega. to jb hmein ek channel (chai aur code) ke no. of subscribers count krne hain to we will count the documents where channel is going to be chai aur code. 

    // but hmein find krna hai ki ek user ne kitne channels ko subscribe krke rkha hai.. then we will select the subsriber and find out the number of channels where it subsribed
}, {
    timestamps: true
})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)