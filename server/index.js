import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Models
const WorkSchema = new mongoose.Schema({
    title: String,
    category: String,
    imageSrc: String,
    description: String,
    tags: [String],
    websiteUrl: String,
    status: { type: String, default: 'Live' },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const Work = mongoose.model('Work', WorkSchema);

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const ProfileSchema = new mongoose.Schema({
    bio: String,
    experience: String,
    location: String,
    email: String,
    updatedAt: { type: Date, default: Date.now }
});
const Profile = mongoose.model('Profile', ProfileSchema);

const SkillSchema = new mongoose.Schema({
    name: String,
    percentage: Number,
    category: String,
    icon: String,
    color: String,
    createdAt: { type: Date, default: Date.now }
});
const Skill = mongoose.model('Skill', SkillSchema);

const MessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

const StatsSchema = new mongoose.Schema({
    totalVisits: { type: Number, default: 0 },
});
const Stats = mongoose.model('Stats', StatsSchema);

// Initial User & Profile Creation
const initializeDB = async () => {
    try {
        // Admin
        const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await User.create({
                username: process.env.ADMIN_USERNAME,
                password: hashedPassword
            });
            console.log('Admin user created');
        }

        // Profile
        const profileExists = await Profile.findOne();
        if (!profileExists) {
            await Profile.create({
                bio: 'Passionate designer and developer focused on creating premium digital experiences.',
                experience: '4+ Years',
                location: 'Tanzania',
                email: 'elishalema@example.com'
            });
            console.log('Default profile created');
        }

        // Stats
        const statsExists = await Stats.findOne();
        if (!statsExists) {
            await Stats.create({ totalVisits: 12480 }); // Start with a realistic offset
        }
    } catch (err) {
        console.error('Error initializing DB:', err);
    }
};
initializeDB();

// Routes
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware for Auth
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Site Interactions
app.post('/api/visit', async (req, res) => {
    await Stats.findOneAndUpdate({}, { $inc: { totalVisits: 1 } });
    res.json({ success: true });
});

app.post('/api/contact', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Works APIs
app.get('/api/works', async (req, res) => {
    try {
        const works = await Work.find().sort({ createdAt: -1 });
        res.json(works);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/works', auth, async (req, res) => {
    const work = new Work(req.body);
    await work.save();
    res.json(work);
});

app.put('/api/works/:id', auth, async (req, res) => {
    const work = await Work.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(work);
});

app.delete('/api/works/:id', auth, async (req, res) => {
    await Work.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
});

app.post('/api/works/:id/view', async (req, res) => {
    try {
        await Work.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Profile APIs
app.get('/api/profile', async (req, res) => {
    const profile = await Profile.findOne();
    res.json(profile);
});

app.put('/api/profile', auth, async (req, res) => {
    const profile = await Profile.findOneAndUpdate({}, req.body, { new: true });
    res.json(profile);
});

// Skills APIs
app.get('/api/skills', async (req, res) => {
    try {
        const skills = await Skill.find().sort({ createdAt: 1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/skills', auth, async (req, res) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.json(skill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/skills/:id', auth, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(skill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/skills/:id', auth, async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Stats API
app.get('/api/stats', async (req, res) => {
    try {
        const projectCount = await Work.countDocuments();
        const topWorks = await Work.find().sort({ views: -1 }).limit(3);
        const stats = await Stats.findOne();
        const messageCount = await Message.countDocuments();
        const recentMessages = await Message.find().sort({ createdAt: -1 }).limit(3);

        res.json({
            metrics: [
                { label: 'Total Visits', value: stats.totalVisits.toLocaleString(), change: '+14%', color: 'primary' },
                { label: 'Form Submissions', value: messageCount.toString(), change: `+${recentMessages.length}`, color: 'secondary' },
                { label: 'Avg Engagement', value: '4m 32s', change: '+22%', color: 'highlight' },
                { label: 'Projects Published', value: projectCount.toString(), change: '0%', color: 'primary' },
            ],
            recentInsights: recentMessages.map(m => ({
                time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                user: m.name,
                type: 'Inquiry',
                content: `New inquiry received from ${m.name}`
            })).concat([
                { time: '09:15 AM', user: 'System', type: 'Status', content: 'All systems operational' }
            ]).slice(0, 4),
            topWorks: topWorks.map(w => ({
                name: w.title,
                views: w.views >= 1000 ? `${(w.views / 1000).toFixed(1)}k` : w.views.toString(),
                color: w.category === 'Logo' ? 'primary' : 'secondary'
            }))
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
