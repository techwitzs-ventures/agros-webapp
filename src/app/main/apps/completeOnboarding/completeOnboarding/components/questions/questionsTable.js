import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { selectUser } from 'app/store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import QuestionsTableHead from './questionsTableHead';
import Questions from 'app/configs/onboardingQuestionsConfig';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useThemeMediaQuery } from '@fuse/hooks';



function QuestionTable(props) {
    // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('xl'));

    return (
        <div className="w-full flex flex-col pb-16 sm:pb-32">
            <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
                <QuestionsTableHead
                    rowCount={Questions.length}
                />

                <TableBody>
                    {Questions.map((n) => {
                        return (
                            <TableRow
                                className="h-72 cursor-pointer"
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={n.id}
                            >

                                <TableCell className="p-4 md:p-16" component="th" scope="row" align='left'>
                                    {n.id}
                                </TableCell>

                                <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                    {n.question}
                                </TableCell>

                                <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                    <FormControl>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >
                                            <FormControlLabel value={n.optionsValue.option1} control={<Radio />} label={n.optionsLabel.option1} />
                                            <FormControlLabel value={n.optionsValue.option2} control={<Radio />} label={n.optionsLabel.option2} />
                                        </RadioGroup>
                                    </FormControl>
                                </TableCell>

                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default QuestionTable;
