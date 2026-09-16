"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaint_controller_1 = require("../controllers/complaint.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.post('/', complaint_controller_1.createComplaint);
router.get('/my', complaint_controller_1.getMyComplaints);
exports.default = router;
//# sourceMappingURL=complaint.routes.js.map